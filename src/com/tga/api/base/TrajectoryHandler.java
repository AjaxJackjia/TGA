package com.tga.api.base;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Calendar;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jettison.json.JSONObject;
import org.geojson.Feature;
import org.geojson.FeatureCollection;
import org.geojson.GeoJsonObject;
import org.geojson.LineString;
import org.geojson.LngLatAlt;
import org.geojson.Point;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tga.api.model.GeometryType;
import com.tga.db.DBUtil;

public class TrajectoryHandler {
	
	public static FeatureCollection getRawGPS(long id) throws SQLException {
		FeatureCollection collection = new FeatureCollection();
		
		String sql = "select " +
					 "	st_x(point) as lng, " +
					 "	st_y(point) as lat, " +
					 "	seq " +
					 "from " + 
					 "	taxi.gps_filter " + 
					 "where " + 
					 "	trip_id = ? " + 
					 "order by " + 
					 "seq asc";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, id);
		stmt.getConnection().setAutoCommit(false);
		ResultSet rs = stmt.executeQuery();
		
		while(rs.next()) {
			Feature feature = new Feature();
			Point point = new Point(rs.getDouble("lng"), rs.getDouble("lat"));
			point.setProperty("trip_id", id);
			point.setProperty("seq", rs.getInt("seq"));
			point.setProperty("lng", rs.getDouble("lng"));
			point.setProperty("lat", rs.getDouble("lat"));
			feature.setGeometry(point);

			collection.add(feature);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return collection;
	}
	
	//TODO
	public static FeatureCollection getAssign(long id) throws SQLException {
		FeatureCollection collection = new FeatureCollection();
		
//		String sql = "select " +
//					 "	st_x(point) as lng, " +
//					 "	st_y(point) as lat, " +
//					 "	seq " +
//					 "from " + 
//					 "	taxi.gps_filter " + 
//					 "where " + 
//					 "	trip_id = ? " + 
//					 "order by " + 
//					 "seq asc";
//		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, id);
//		stmt.getConnection().setAutoCommit(false);
//		ResultSet rs = stmt.executeQuery();
//		
//		while(rs.next()) {
//			Feature feature = new Feature();
//			Point point = new Point(rs.getDouble("lng"), rs.getDouble("lat"));
//			point.setProperty("trip_id", id);
//			point.setProperty("seq", rs.getInt("seq"));
//			point.setProperty("lng", rs.getDouble("lng"));
//			point.setProperty("lat", rs.getDouble("lat"));
//			feature.setGeometry(point);
//			
//			collection.add(feature);
//		}
//		DBUtil.getInstance().closeStatementResource(stmt);
		
		return collection;
	}
	
	//TODO
	public static FeatureCollection getAugment(long id) throws SQLException {
		FeatureCollection collection = new FeatureCollection();
		
//		String sql = "select " +
//					 "	st_x(point) as lng, " +
//					 "	st_y(point) as lat, " +
//					 "	seq " +
//					 "from " + 
//					 "	taxi.gps_filter " + 
//					 "where " + 
//					 "	trip_id = ? " + 
//					 "order by " + 
//					 "seq asc";
//		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, id);
//		stmt.getConnection().setAutoCommit(false);
//		ResultSet rs = stmt.executeQuery();
//		
//		while(rs.next()) {
//			Feature feature = new Feature();
//			Point point = new Point(rs.getDouble("lng"), rs.getDouble("lat"));
//			point.setProperty("trip_id", id);
//			point.setProperty("seq", rs.getInt("seq"));
//			point.setProperty("lng", rs.getDouble("lng"));
//			point.setProperty("lat", rs.getDouble("lat"));
//			feature.setGeometry(point);
//			
//			collection.add(feature);
//		}
//		DBUtil.getInstance().closeStatementResource(stmt);
		
		return collection;
	}
}