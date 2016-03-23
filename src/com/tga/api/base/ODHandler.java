package com.tga.api.base;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Calendar;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.geojson.Feature;
import org.geojson.FeatureCollection;
import org.geojson.GeoJsonObject;
import org.geojson.LineString;
import org.geojson.LngLatAlt;
import org.geojson.MultiLineString;
import org.geojson.Point;
import org.geojson.Polygon;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tga.api.model.GeometryType;
import com.tga.db.DBUtil;

public class ODHandler {
	
	public static JSONArray getOriginalODData(int odType, double p_left, double p_right, double p_up, double p_down) throws SQLException, JSONException {
		JSONArray points = new JSONArray();
		
		String type = odType == 1 ? "o_point" : "d_point";
		String sql = "SELECT " + 
					 "	ST_X(" + type + ") as lng, " + 
					 "	ST_Y(" + type + ") as lat " + 
					 "FROM " + 
					 "	taxi.trips_od " + 
					 "WHERE " + 
					 "	ST_X(" + type + ") >= ? and " + 
					 "	ST_X(" + type + ") <= ? and " + 
					 "	ST_Y(" + type + ") >= ? and " + 
					 "	ST_Y(" + type + ") <= ? ";
		
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_left, p_right, p_down, p_up);
		stmt.getConnection().setAutoCommit(false);
		ResultSet rs = stmt.executeQuery();
		
		while(rs.next()) {
			JSONObject point = new JSONObject();
			point.put("lng", rs.getDouble("lng"));
			point.put("lat", rs.getDouble("lat"));
			point.put("count", 1);
			
			points.put(point);
		}
		
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return points;
	}

	public static FeatureCollection getTrajectoriesByOD(Point o, Point d, int p_radius, int p_limit) throws SQLException {
		FeatureCollection collection = new FeatureCollection();
		
		//get trip ids
		ArrayList<Long> tripIds = new ArrayList<Long>();
		String tripIdSql = "select " +
						 "	id " +
						 "from " + 
						 "	taxi.trips_od " +
						 "where " + 
						 "	st_distance_sphere(o_point, st_point(?, ?)) <= ? and " +
						 "	st_distance_sphere(d_point, st_point(?, ?)) <= ? " +
						 "limit ? ";
		
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(tripIdSql, 
				o.getCoordinates().getLongitude(), o.getCoordinates().getLatitude(), p_radius, 
				d.getCoordinates().getLongitude(), d.getCoordinates().getLatitude(), p_radius, p_limit);
		stmt.getConnection().setAutoCommit(false);
		ResultSet rs = stmt.executeQuery();
		
		while(rs.next()) {
			tripIds.add(rs.getLong("id"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//get trip gps
		if(tripIds.size() > 0) {
			String tripsSql ="select " +
							"	trip_id, " +
							"	seq, " +
							 "	st_x(point) as lng, " +
							 "	st_y(point) as lat " +
							 "from " + 
							 "	taxi.gps_filter " +
							 "where " + 
							 "	trip_id in ( " + StringUtils.join(tripIds.toArray(), ",") + " ) " + 
							 "order by " + 
							 "	trip_id, seq ";
			
			stmt = DBUtil.getInstance().createSqlStatement(tripsSql);
			stmt.getConnection().setAutoCommit(false);
			rs = stmt.executeQuery();
			
			long currentTripId = 0L;
			Feature feature = null;
			LineString trajectory = null;
			
			while(rs.next()) {
				long tripId = rs.getLong("trip_id");
				
				if(currentTripId != tripId) {
					if(feature != null) {
						collection.add(feature);
					}
					feature = new Feature();
					trajectory = new LineString();
					trajectory.setProperty("id", rs.getLong("trip_id"));
					trajectory.add(new LngLatAlt(rs.getDouble("lng"), rs.getDouble("lat")));
					feature.setGeometry(trajectory);
					
					currentTripId = tripId;
				}else{
					trajectory.add(new LngLatAlt(rs.getDouble("lng"), rs.getDouble("lat")));
				}
			}
			collection.add(feature);
			
			DBUtil.getInstance().closeStatementResource(stmt);
		}
		
		return collection;
	}
	
}