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
	
	public static GeoJsonObject getTrajectory(long id) throws SQLException {
		Point point = null;
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement("select * from taxi.get_node(?)", id);
		stmt.getConnection().setAutoCommit(false);
		ResultSet rs = stmt.executeQuery();
		
		while(rs.next()) {
			point = new Point(rs.getDouble("lng"), rs.getDouble("lat"));
			point.setProperty("id", id);
			point.setProperty("lng", rs.getDouble("lng"));
			point.setProperty("lat", rs.getDouble("lat"));
			point.setProperty("way_id", rs.getLong("way_id"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return point;
	}
	
	public static GeoJsonObject getWay(long id) throws SQLException {
		LineString way = new LineString();
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement("select taxi.get_way(?)", id);
		stmt.getConnection().setAutoCommit(false);
		ResultSet rs_stmt = stmt.executeQuery();
		ResultSet rs_way = null, rs_tags = null;
		
		if (rs_stmt.next()) {
			rs_way = (ResultSet) rs_stmt.getObject(1);
			rs_stmt.next();
			rs_tags = (ResultSet) rs_stmt.getObject(1);
		}
		stmt.getConnection().commit();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		while (rs_way.next()) {
			way.add(new LngLatAlt(rs_way.getDouble("longitude"), rs_way.getDouble("latitude")));
		}
		
		while (rs_tags.next()) {
			way.setProperty(rs_tags.getString("key"), rs_tags.getString("value"));
		}
		
		rs_way.close();
		rs_tags.close();
		
		return way;
	}
	
	public static GeoJsonObject getSegment(long id) throws SQLException {
		LineString segment = new LineString();
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement("select taxi.get_segment(?)", id);
		stmt.getConnection().setAutoCommit(false);
		ResultSet rs = stmt.executeQuery();
		if (rs.next())
			rs = (ResultSet) rs.getObject(1);
		
		while (rs.next()) {
			segment.add(new LngLatAlt(rs.getDouble("from_lng"), rs.getDouble("from_lat")));
			segment.add(new LngLatAlt(rs.getDouble("to_lng"), rs.getDouble("to_lat")));
			
			segment.setProperty("from_node", rs.getLong("from_node"));
			segment.setProperty("to_node", rs.getLong("to_node"));
			segment.setProperty("segment_id", id);
			segment.setProperty("section_id", rs.getLong("section_id"));
			segment.setProperty("way_id", rs.getLong("way_id"));
			segment.setProperty("way_name", rs.getString("way_name"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return segment;
	}
	
	public static GeoJsonObject getSection(long id) throws SQLException {
		LineString section = new LineString();
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement("select taxi.get_section(?)", id);
		stmt.getConnection().setAutoCommit(false);
		ResultSet rs = stmt.executeQuery();
		if (rs.next())
			rs = (ResultSet) rs.getObject(1);
		ArrayList<Long> segments = new ArrayList<Long>();
		int count = 0;
		
		while (rs.next()) {
			//poionts
			if(count == 0) {
				section.add(new LngLatAlt(rs.getDouble("from_lng"), rs.getDouble("from_lat")));
				section.add(new LngLatAlt(rs.getDouble("to_lng"), rs.getDouble("to_lat")));
			}else{
				section.add(new LngLatAlt(rs.getDouble("to_lng"), rs.getDouble("to_lat")));
			}
			
			//segments
			segments.add(rs.getLong("segment_id"));
			
			//properties
			if(count == 0) {
				section.setProperty("section_id", rs.getLong("section_id"));
				section.setProperty("way_id", rs.getLong("way_id"));
				section.setProperty("way_name", rs.getString("way_name"));
			}
			count++;
		}
		section.setProperty("segments", StringUtils.join(segments.toArray(), ","));
		
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return section;
	}
}