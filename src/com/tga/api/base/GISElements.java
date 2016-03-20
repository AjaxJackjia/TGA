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
import org.geojson.MultiLineString;
import org.geojson.Point;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tga.api.model.GeometryType;
import com.tga.db.DBUtil;

public class GISElements {
	
	public static GeoJsonObject getNode(long id) throws SQLException {
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
		MultiLineString section = new MultiLineString();
		
		String sql = "select " + 
					 "	T2.id as section_id, " +
					 "	T3.id as segment_id, " +
					 "	ST_X(T4.geom) as from_lng, " +
					 "	ST_Y(T4.geom) as from_lat, " +
					 "	ST_X(T5.geom) as to_lng, " +
					 "	ST_Y(T5.geom) as to_lat " +
					 "from " + 
					 "	taxi.segment_section T1, " +
					 "	taxi.sections T2, " + 
					 "	taxi.segments T3, " + 
					 "	nodes T4, " + 
					 "	nodes T5 " + 
					 "where " + 
					 "	T1.segment_id = T3.id and " + 
					 "	T1.section_id = T2.id and " + 
					 "	T3.from_node = T4.id and " + 
					 "	T3.to_node = T5.id and " + 
					 "	T2.id = ? " +
					 "order by " + 
					 "	T3.id ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, id);
		stmt.getConnection().setAutoCommit(false);
		ResultSet rs = stmt.executeQuery();
		ArrayList<Long> segments = new ArrayList<Long>();
		int count = 0;
		
		while (rs.next()) {
			//poionts
			LineString segment = new LineString();
			segment.add(new LngLatAlt(rs.getDouble("from_lng"), rs.getDouble("from_lat")));
			segment.add(new LngLatAlt(rs.getDouble("to_lng"), rs.getDouble("to_lat")));
			section.add(segment.getCoordinates());
			
			//segments
			segments.add(rs.getLong("segment_id"));
			
			//properties
			if(count == 0) {
				section.setProperty("section_id", rs.getLong("section_id"));
			}
			count++;
		}
		section.setProperty("segments", StringUtils.join(segments.toArray(), ","));
		
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return section;
	}
	
	public static FeatureCollection getSections(double p_left, double p_right, double p_up, double p_down) throws SQLException {
		FeatureCollection collection = new FeatureCollection();
		
		String sql = "select " + 
					 "	T2.id as section_id, " +
					 "	T3.id as segment_id, " +
					 "	ST_X(T4.geom) as from_lng, " +
					 "	ST_Y(T4.geom) as from_lat, " +
					 "	ST_X(T5.geom) as to_lng, " +
					 "	ST_Y(T5.geom) as to_lat " +
					 "from " + 
					 "	taxi.segment_section T1, " +
					 "	taxi.sections T2, " + 
					 "	taxi.segments T3, " + 
					 "	nodes T4, " + 
					 "	nodes T5 " + 
					 "where " + 
					 "	T1.segment_id = T3.id and " + 
					 "	T1.section_id = T2.id and " + 
					 "	T3.from_node = T4.id and " + 
					 "	T3.to_node = T5.id and " + 
					 "	ST_X(T4.geom) >= " + p_left + " and ST_X(T4.geom) <= " + p_right + " and " + 
					 "	ST_Y(T4.geom) >= " + p_down + " and ST_Y(T4.geom) <= " + p_up + " and " + 
					 "	ST_X(T5.geom) >= " + p_left + " and ST_X(T5.geom) <= " + p_right + " and " + 
					 "	ST_Y(T5.geom) >= " + p_down + " and ST_Y(T5.geom) <= " + p_up + " " + 
					 "order by " + 
					 "	T2.id, T3.id ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql);
		stmt.getConnection().setAutoCommit(false);
		ResultSet rs = stmt.executeQuery();
		
		long currentSectionId = 0L;
		Feature feature = null;
		MultiLineString section = null;
		
		while (rs.next()) {
			long sectionId = rs.getLong("section_id");
			if(currentSectionId != sectionId) {
				if(feature != null) {
					collection.add(feature);
				}
				
				feature = new Feature();
				section = new MultiLineString();
				section.setProperty("section_id", rs.getLong("section_id"));
				feature.setGeometry(section);
				
				LineString segment = new LineString();
				segment.add(new LngLatAlt(rs.getDouble("from_lng"), rs.getDouble("from_lat")));
				segment.add(new LngLatAlt(rs.getDouble("to_lng"), rs.getDouble("to_lat")));
				section.add(segment.getCoordinates());
				
				currentSectionId = sectionId;
			}else{
				LineString segment = new LineString();
				segment.add(new LngLatAlt(rs.getDouble("from_lng"), rs.getDouble("from_lat")));
				segment.add(new LngLatAlt(rs.getDouble("to_lng"), rs.getDouble("to_lat")));
				section.add(segment.getCoordinates());
			}
		}
		collection.add(feature);
		
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return collection;
	}
}