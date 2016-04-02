package com.tga.api.algorithm;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Set;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.geojson.Feature;
import org.geojson.FeatureCollection;
import org.geojson.GeoJsonObject;
import org.geojson.LngLatAlt;
import org.geojson.MultiPoint;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tga.api.model.ClusterObj;
import com.tga.db.DBUtil;

public class Hotline {
	private HashMap<String, ClusterObj> AC_s; 		//原始数据集
	private ArrayList<String> orderList;		//最终输出的有序列表 (id集合)
	private LinkedList<String> seedList;		//中间临时列表 (id集合)
	
	private double epsilon;
	private double epsilon_cluster;
	private int minPts;
	
	public Hotline(double epsilon, double epsilon_cluster, int minPts) {
		this.AC_s = new HashMap<String, ClusterObj>();
		this.orderList = new ArrayList<String>();
		this.seedList = new LinkedList<String>();
		
		this.epsilon = epsilon;
		this.epsilon_cluster = epsilon_cluster;
		this.minPts = minPts;
	}
	
	public JSONObject opticsClustering(double center_lng, double center_lat, int scale_a, int scale_b) throws SQLException, JSONException, JsonProcessingException {
		JSONObject result = new JSONObject();

		//step 1. 获得点集
		getAC(center_lng, center_lat, scale_a, scale_b);
		System.out.println("AC_s的规模：" + AC_s.size());
		
		//step 2. 生成有序排列
		runOptics();
		
		//step 3. 聚类
		int clusterNum = clustering(epsilon_cluster) + 2;
		
		//step 4. 生成结果
		result = generateResult(clusterNum);
		
		return result;
	}
	
	public JSONObject DBSCANClustering(double center_lng, double center_lat, int scale_a, int scale_b) throws SQLException, JSONException, JsonProcessingException {
		JSONObject result = new JSONObject();

		//step 1. 获得点集
		getAC(center_lng, center_lat, scale_a, scale_b);
		System.out.println("AC_s的规模：" + AC_s.size());
		
		//step 2. 聚类
		int clusterNum = runDBSCAN();
		System.out.println("DBSCAN数量:" + clusterNum);
		
		//step 4. 生成结果
		result = generateDBSCANResult(clusterNum);
		
		return result;
	}
	
	///////////////////////////////////////
	
	// 获取中心点ab范围之内上车的下车点集合
	private void getAC(double center_lng, double center_lat, int scale_a, int scale_b) throws SQLException {
		double min_lng = center_lng - meter2LngDegree(center_lat, scale_a);
		double max_lng = center_lng + meter2LngDegree(center_lat, scale_a);
		double min_lat = center_lat - meter2LatDegree(scale_b);
		double max_lat = center_lat + meter2LatDegree(scale_b);
		
		String sql = "select " + 
					 "	ST_X(d_point) as lng, " +
					 "	ST_Y(d_point) as lat " +
					 "from " + 
					 "	taxi.trips_od " +
					 "where " + 
					 "	ST_X(o_point) <= ? and " + 
					 "	ST_X(o_point) >= ? and " + 
					 "	ST_Y(o_point) <= ? and " + 
					 "	ST_Y(o_point) >= ? ";
		
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, max_lng, min_lng, max_lat, min_lat);
		stmt.getConnection().setAutoCommit(false);
		ResultSet rs = stmt.executeQuery();
		
		while (rs.next()) {
			ClusterObj obj = new ClusterObj(rs.getDouble("lng"), rs.getDouble("lat"));
			AC_s.put(obj.getId(), obj);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
	}
	
	// 高密度区域聚类算法之有序排列生成（OPTICS函数）
	private void runOptics() {
		Set<String> keys = AC_s.keySet();
		for(String id : keys) {
			if(!AC_s.get(id).isVisited()) {
				//标记obj为已访问
				AC_s.get(id).setVisited(true);
				
				//计算邻域
				calculateN_epsilon(id);
				
				//计算core distance
				calculateCoreDistance(id);
				
				//插入到有序列表
				orderList.add(id);
				
				if(AC_s.get(id).getN_epsilon().size() >= minPts) {
					//更新
					update(id);
					
					while(seedList.size() != 0) {
						//取出seedList最前元素
						String currentId = seedList.poll();
						
						//标记currentObj为已访问
						AC_s.get(currentId).setVisited(true);
						
						//计算邻域
						calculateN_epsilon(currentId);
						
						//计算core distance
						calculateCoreDistance(currentId);
						
						//插入到有序列表
						orderList.add(currentId);
						
						if(AC_s.get(currentId).getN_epsilon().size() >= minPts) {
							//更新
							update(id);
						}
					}
				}
			}
		}
	}
	
	// 高密度区域聚类算法之有序排列更新算法（Update函数）
	private void update(String currentid) {
		for(String id : AC_s.get(currentid).getN_epsilon()) {
			if(!AC_s.get(id).isVisited()) {
				double dist = Math.max(AC_s.get(currentid).getCoreDis(), dis(AC_s.get(id), AC_s.get(currentid)));
				if(AC_s.get(id).getReachabilityDis() == -1) {
					AC_s.get(id).setReachabilityDis(dist);
					
					seedList.push(id);
					Collections.sort(seedList, new Comparator<String>() {
						@Override
						public int compare(String o1, String o2) { //升序
							return (int) (AC_s.get(o1).getReachabilityDis() - AC_s.get(o2).getReachabilityDis());
						}
					});
				}else{
					if(dist < AC_s.get(id).getReachabilityDis()) {
						AC_s.get(id).setReachabilityDis(dist);
						
						seedList.push(id);
						Collections.sort(seedList, new Comparator<String>() {
							@Override
							public int compare(String o1, String o2) { //升序
								return (int) (AC_s.get(o1).getReachabilityDis() - AC_s.get(o2).getReachabilityDis());
							}
						});
					}
				}
			}
		}
	}
	
	// 高密度区域聚类算法之聚类生成算法（Clustering函数）
	private int clustering(double epsilon_change) {
		int clusterid = -1;
		Set<String> keys = AC_s.keySet();
		for(String id : keys) {
			if(AC_s.get(id).getReachabilityDis() > epsilon_change) {
				if(AC_s.get(id).getCoreDis() <= epsilon_change) {
					clusterid++;
					AC_s.get(id).setCluster(clusterid);
				}else{
					AC_s.get(id).setCluster(-1);
				}
			}else{
				AC_s.get(id).setCluster(clusterid);
			}
		}
		
		return clusterid;
	}
	
	/*
	 * tool function
	 * */
	private static double meter2LatDegree(double length) {
		// 1 degree = 111km
		final double L = 111700;
		return length / L;
	}
	
	private static double meter2LngDegree(double lat, double length) {
		final double L = 111700 * Math.abs(Math.cos(lat));
		return length / L;
	}
	
	//计算obj的邻域集合
	private void calculateN_epsilon(String currentid) {
		Set<String> keys = AC_s.keySet();
		for(String id : keys) {
			if(currentid.equals(id)) {
				continue;//排除自身
			}
			
			if(dis(AC_s.get(id), AC_s.get(currentid)) <= epsilon) {
				AC_s.get(currentid).getN_epsilon().add(id);
			}
		}
	}
	
	//计算obj的core distance
	private void calculateCoreDistance(String currentid) {
		//计算第minPts近的距离
		ArrayList<Double> distanceList = new ArrayList<Double>();
		for(String id : AC_s.get(currentid).getN_epsilon()) {
			distanceList.add(dis(AC_s.get(id), AC_s.get(currentid)));
		}
		Collections.sort(distanceList);
		
		//设置距离
		if(AC_s.get(currentid).getN_epsilon().size() >= minPts) {
			AC_s.get(currentid).setCoreDis(distanceList.get(minPts-1));
		}
	}
		
	//计算两点间的距离
	private final static double EARTH_RADIUS = 6378137; //地球半径, meter
	private static double rad(double d)
	{
		return d * Math.PI / 180.0;
	}
	private static double dis(ClusterObj obj1, ClusterObj obj2) {
		double radLat1 = rad(obj1.getLat());
		double radLat2 = rad(obj2.getLat());
		double a = radLat1 - radLat2;
		double b = rad(obj1.getLng()) - rad(obj2.getLng());
		double s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
				Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
		s = s * EARTH_RADIUS;
		
		return s;
	}

	//生成结果
	private JSONObject generateResult(int clusterNum) throws JSONException, JsonProcessingException {
		JSONObject result = new JSONObject();
		
		//initialize
		double max = 0;
		ArrayList<MultiPoint> clusters = new ArrayList<MultiPoint>();
		for(int i = 0; i < clusterNum; i++) {
			clusters.add(new MultiPoint());
		}
		
		//retrieve basic info
		Set<String> keys = AC_s.keySet();
		for(String id : keys) {
			//max distance
			if(max < AC_s.get(id).getReachabilityDis()) {
				max = AC_s.get(id).getReachabilityDis();
			}
			
			//cluster
			int clusterType = AC_s.get(id).getCluster();
			clusters.get(clusterType+1).add(new LngLatAlt(AC_s.get(id).getLng(), AC_s.get(id).getLat()));
		}
		Collections.sort(clusters, new Comparator<MultiPoint>() {
			@Override
			public int compare(MultiPoint o1, MultiPoint o2) { //降序
				return (int) (o2.getCoordinates().size() - o1.getCoordinates().size());
			}
		});
		for(MultiPoint ps : clusters) {
			System.out.println(ps.getCoordinates().size());
		}
		
		
		//cluster layer
		int clusterTypeNum = clusters.size() > 10 ? 10 : clusters.size();
		FeatureCollection featureCollection = new FeatureCollection();
		for (int i = 0; i < clusterTypeNum; ++i) {
			if(i == 0) continue;//噪音
			
			Feature feature = new Feature();
			featureCollection.add(feature);
			
			GeoJsonObject points = clusters.get(i);
			points.setProperty("cluster", i - 1);
			points.setProperty("number", clusters.get(i).getCoordinates().size());
			
			feature.setGeometry(points);
		}
		
		ObjectMapper mapper = new ObjectMapper();
		result.put("clusters", mapper.writeValueAsString(featureCollection));
		
		//reachability distance plot
		JSONArray reachabilityDis = new JSONArray();
		for(String id : keys) {
			reachabilityDis.put(AC_s.get(id).getReachabilityDis() == -1 ? max * 1.3 : AC_s.get(id).getReachabilityDis());
		}
		result.put("reachabilityDis", reachabilityDis);
		
		return result;
	}
	
	///////////////////////////////////////
	private int runDBSCAN() {
		int C = -1;
		Set<String> keys = AC_s.keySet();
		for(String id : keys) {
			if(!AC_s.get(id).isVisited()) {
				//标记obj为已访问
				AC_s.get(id).setVisited(true);
				
				//计算邻域
				calculateDBSCAN_N_epsilon(id);
				
				if(AC_s.get(id).getN_epsilon().size() >= minPts) {
					C++;
					expandCluster(id, C);
				}
			}
		}
		return C+2;
	}
	
	private void expandCluster(String currentid, int currentCluster) {
		AC_s.get(currentid).setCluster(currentCluster);
		for(String id : AC_s.get(currentid).getN_epsilon()) {
			if(!AC_s.get(id).isVisited()) {
				
				AC_s.get(id).setVisited(true);
				calculateDBSCAN_N_epsilon(id);
				
				if(AC_s.get(id).getN_epsilon().size() >= minPts) {
					AC_s.get(id).setCluster(currentCluster);
					expandCluster(id, currentCluster);
				}
			}
		}
	}
	
	//计算obj的邻域集合
	private void calculateDBSCAN_N_epsilon(String currentid) {
		Set<String> keys = AC_s.keySet();
		for(String id : keys) {
			if(dis(AC_s.get(id), AC_s.get(currentid)) <= epsilon) {
				AC_s.get(currentid).getN_epsilon().add(id);
			}
		}
	}
	
	private JSONObject generateDBSCANResult(int clusterNum) throws JsonProcessingException, JSONException {
		JSONObject result = new JSONObject();
		
		//initialize
		ArrayList<MultiPoint> clusters = new ArrayList<MultiPoint>();
		for(int i = 0; i < clusterNum; i++) {
			clusters.add(new MultiPoint());
		}
		
		//retrieve basic info
		Set<String> keys = AC_s.keySet();
		for(String id : keys) {
			int clusterType = AC_s.get(id).getCluster();
			clusters.get(clusterType+1).add(new LngLatAlt(AC_s.get(id).getLng(), AC_s.get(id).getLat()));
		}
		Collections.sort(clusters, new Comparator<MultiPoint>() {
			@Override
			public int compare(MultiPoint o1, MultiPoint o2) { //降序
				return (int) (o2.getCoordinates().size() - o1.getCoordinates().size());
			}
		});
		
		//cluster layer
		int clusterTypeNum = clusters.size() > 10 ? 10 : clusters.size();
		FeatureCollection featureCollection = new FeatureCollection();
		for (int i = 0; i < clusterTypeNum; ++i) {
			//if(i == 0) continue;//噪音
			
			Feature feature = new Feature();
			featureCollection.add(feature);
			
			GeoJsonObject points = clusters.get(i);
			points.setProperty("cluster", i - 1);
			points.setProperty("number", clusters.get(i).getCoordinates().size());
			
			feature.setGeometry(points);
		}
		
		ObjectMapper mapper = new ObjectMapper();
		result.put("clusters", mapper.writeValueAsString(featureCollection));
		
		//reachability distance plot
		JSONArray reachabilityDis = new JSONArray();
		for(String id : keys) {
			reachabilityDis.put(0);
		}
		result.put("reachabilityDis", reachabilityDis);
		
		return result;
	}
}
