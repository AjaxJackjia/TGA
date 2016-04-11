package com.tga.api.access;

import java.sql.SQLException;
import java.util.ArrayList;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.geojson.FeatureCollection;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tga.api.algorithm.Hotline;
import com.tga.api.algorithm.OnlineDetection;
import com.tga.api.base.BaseService;

@Path("/app")
public class AppService extends BaseService {
	private static final Log LOGGER = LogFactory.getLog("InfoLog");
	
	@GET
	@Path("/detection/calculation")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getOnlineDetectionCalculation() throws JSONException 
	{
		//augmented current atr
		String augmentedCurStr = "15359,40857,40858,1425,1426,1427,1428,1429,34423,34443,34444,34445,34699,34700,34701,34702,34703,34704,34705,1571,1572,1573,1574,1575,1576,1577,1578,2463,2464,2465,42953,3504,3505,3506,3507,3508,3509,3510,2962,2963,2966,18162,18165,18166,18137,18138,18139,18140,18141,18142,18143,18144,18145,18146,18147,35624,16826,16827,16828,16829,16830,16831,16832,16833,16834,16835";
		ArrayList<Long> augmented_cur_atr = OnlineDetection.getIdList(augmentedCurStr);
		//gps point assigned atr
		String assignedStr = "40857,1427,1427,1428,34443,34699,34702,34703,1574,1575,1577,2463,2464,3504,3506,3506,3507,3510,18162,18139,18143,18147,16826,16831,16835";
		ArrayList<Long> assigned_cur_atr = OnlineDetection.getIdList(assignedStr);
		
		//recommend atrs
		ArrayList<ArrayList<Long>> rec_atrs = new ArrayList<ArrayList<Long>>();
		//#1: 15359,40857,40858,1425,1426,1427,1428,1429,34423,34424,34425,34426,34435,34427,34428,34429,2977,2978,2979,2981,2982,2983,2984,2960,2961,3511,2962,2963,2966,18162,18165,18166,18137,18138,18139,18140,18141,18142,18143,18144,18145,18146,18147,35624,16826,16827,16828,16829,16830,16831,16832,16833,16834,16835
		String str1 = "15359,40857,40858,1425,1426,1427,1428,1429,34423,34424,34425,34426,34435,34427,34428,34429,2977,2978,2979,2981,2982,2983,2984,2960,2961,3511,2962,2963,2966,18162,18165,18166,18137,18138,18139,18140,18141,18142,18143,18144,18145,18146,18147,35624,16826,16827,16828,16829,16830,16831,16832,16833,16834,16835";
		ArrayList<Long> rec_1 = OnlineDetection.getIdList(str1);
		
		//#2: 34430,15339,40200,15346,35517,35518,10469,10468,17705,17704,24607,1197,1191,1192,1193,17865,34722,17864,37928,37929,2745,2746,2747,2748,2749,2750,2751,2752,2753,2754,2756,29795,29796,29797,18145,18146,18147,35624,16826,16827,16828,16829,16830,16831,16832,16833,16834,16835
		String str2 = "34430,15339,40200,15346,35517,35518,10469,10468,17705,17704,24607,1197,1191,1192,1193,17865,34722,17864,37928,37929,2745,2746,2747,2748,2749,2750,2751,2752,2753,2754,2756,29795,29796,29797,18145,18146,18147,35624,16826,16827,16828,16829,16830,16831,16832,16833,16834,16835";
		ArrayList<Long> rec_2 = OnlineDetection.getIdList(str2);
		
		//#3: 15359,40857,40858,1425,1426,1427,1428,1429,34423,34424,34425,34426,34435,34427,34428,34429,2977,2978,2979,2981,2982,2983,2984,2960,2961,3511,2962,2963,2966,18162,18165,18166,18137,18138,18139,18140,18141,18142,18143,18144,29798,29799,29800,29801,29802,29803,16814,16815,16816,16817,16818,16835
		String str3 = "15359,40857,40858,1425,1426,1427,1428,1429,34423,34424,34425,34426,34435,34427,34428,34429,2977,2978,2979,2981,2982,2983,2984,2960,2961,3511,2962,2963,2966,18162,18165,18166,18137,18138,18139,18140,18141,18142,18143,18144,29798,29799,29800,29801,29802,29803,16814,16815,16816,16817,16818,16835";
		ArrayList<Long> rec_3 = OnlineDetection.getIdList(str3);
		
		//#4: 15359,40857,40858,1425,1426,1427,1428,1429,34423,34424,34425,34426,34435,34427,34428,34429,2977,2978,2979,2981,2982,2983,2984,2985,2986,2968,18046,18047,18048,18045,18034,18035,18036,18037,18038,18039,18040,18041,18041,18042,18043,18044,3094,3150,3151,3108,3153,3123,3124,35704,35692,35693,35694,35695,35696,35697,16837,16836,16835
		String str4 = "15359,40857,40858,1425,1426,1427,1428,1429,34423,34424,34425,34426,34435,34427,34428,34429,2977,2978,2979,2981,2982,2983,2984,2985,2986,2968,18046,18047,18048,18045,18034,18035,18036,18037,18038,18039,18040,18041,18041,18042,18043,18044,3094,3150,3151,3108,3153,3123,3124,35704,35692,35693,35694,35695,35696,35697,16837,16836,16835";
		ArrayList<Long> rec_4 = OnlineDetection.getIdList(str4);
		
		//#5: 34430,15339,40200,15346,2947,2948,1201,3209,324,325,326,29778,29779,29780,27824,3542,27832,27833,27834,27835,3172,3167,3163,3157,18024,18038,18039,18040,18041,18041,18042,18043,18044,3094,3150,3151,3108,3153,3123,3124,35704,35692,35693,35694,35695,35696,35697,16837,16836,16835
		String str5 = "34430,15339,40200,15346,2947,2948,1201,3209,324,325,326,29778,29779,29780,27824,3542,27832,27833,27834,27835,3172,3167,3163,3157,18024,18038,18039,18040,18041,18041,18042,18043,18044,3094,3150,3151,3108,3153,3123,3124,35704,35692,35693,35694,35695,35696,35697,16837,16836,16835";
		ArrayList<Long> rec_5 = OnlineDetection.getIdList(str5);
		
		rec_atrs.add(rec_1);
		rec_atrs.add(rec_2);
		rec_atrs.add(rec_3);
		rec_atrs.add(rec_4);
		rec_atrs.add(rec_5);
		
		JSONArray result = OnlineDetection.calcuateAnamolyScore(assigned_cur_atr, augmented_cur_atr, rec_atrs);
		
		return buildResponse(OK, result);
	}
	
	@GET
	@Path("/hotline/calculation")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getHotlineCalculation(
			@QueryParam("center_lng") double p_center_lng,
			@QueryParam("center_lat") double p_center_lat,
			@QueryParam("scale_a") int p_scale_a,
			@QueryParam("scale_b") int p_scale_b,
			@QueryParam("epsilon") double p_epsilon,
			@QueryParam("epsilon_cluster") double p_epsilon_cluster,
			@QueryParam("minPts") int p_minPts) throws JSONException, SQLException, JsonProcessingException 
	{
		final double DEFAULT_epsilon = 50; //meter
		final double DEFAULT_epsilon_cluster = 25; //meter
		final int DEFAULT_minPts = 10; //number of points
		
		final int DEFAULT_scale_a = 300; //meter
		final int DEFAULT_scale_b = 300; //meter
		
		if(p_scale_a == 0) p_scale_a = DEFAULT_scale_a;
		if(p_scale_b == 0) p_scale_b = DEFAULT_scale_b;
		if(p_epsilon == 0) p_epsilon = DEFAULT_epsilon;
		if(p_epsilon_cluster == 0) p_epsilon_cluster = DEFAULT_epsilon_cluster;
		if(p_minPts  == 0) p_minPts  = DEFAULT_minPts;
		
		Hotline hotline = new Hotline(p_epsilon, p_epsilon_cluster, p_minPts);
		JSONObject result = hotline.opticsClustering(p_center_lng, p_center_lat, p_scale_a, p_scale_b);
//		JSONObject result = hotline.DBSCANClustering(p_center_lng, p_center_lat, p_scale_a, p_scale_b);
		
		return buildResponse(OK, result);
	}
	
	@GET
	@Path("/hotline/cluster_square")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getHotlineClusterSquareCalculation(
			@QueryParam("center_lng") double p_center_lng,
			@QueryParam("center_lat") double p_center_lat,
			@QueryParam("scale_a") int p_scale_a,
			@QueryParam("scale_b") int p_scale_b,
			@QueryParam("type") String p_type,
			@QueryParam("limit") int p_limit ) throws JSONException, SQLException, JsonProcessingException 
	{
		
		JSONObject result = new JSONObject();
		FeatureCollection featureCollection = null;
		if(p_type.equals("D")) {
			featureCollection = Hotline.getSquare_Ds(p_center_lng, p_center_lat, p_scale_a, p_scale_b, p_limit);
		}else{
			featureCollection = Hotline.getSquare_Os(p_center_lng, p_center_lat, p_scale_a, p_scale_b, p_limit);
		}
		
		ObjectMapper mapper = new ObjectMapper();
		result.put("cluster", mapper.writeValueAsString(featureCollection));
		
		return buildResponse(OK, result);
	}
	
	@GET
	@Path("/hotline/cluster_circle")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getHotlineClusterCircleCalculation(
			@QueryParam("center_lng") double p_center_lng,
			@QueryParam("center_lat") double p_center_lat,
			@QueryParam("radius") int p_radius,
			@QueryParam("type") String p_type,
			@QueryParam("limit") int p_limit ) throws JSONException, SQLException, JsonProcessingException 
	{
		JSONObject result = new JSONObject();
		FeatureCollection featureCollection = null;
		if(p_type.equals("D")) {
			featureCollection = Hotline.getCircle_Ds(p_center_lng, p_center_lat, p_radius, p_limit);
		}else{
			featureCollection = Hotline.getCircle_Os(p_center_lng, p_center_lat, p_radius, p_limit);
		}
		
		ObjectMapper mapper = new ObjectMapper();
		result.put("cluster", mapper.writeValueAsString(featureCollection));
		
		return buildResponse(OK, result);
	}
}