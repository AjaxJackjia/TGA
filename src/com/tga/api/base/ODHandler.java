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
import org.geojson.Point;
import org.geojson.Polygon;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tga.api.model.GeometryType;
import com.tga.db.DBUtil;

public class ODHandler {
	
	public static JSONArray getOriginalODData(int odType, double p_left, double p_right, double p_up, double p_down) throws SQLException, JSONException {
		JSONArray points = new JSONArray();
		
		String type = odType == 0 ? "o_point" : "d_point";
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
	
}