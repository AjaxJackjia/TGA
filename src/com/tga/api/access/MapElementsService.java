package com.tga.api.access;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.geojson.Feature;
import org.geojson.FeatureCollection;
import org.geojson.GeoJsonObject;
import org.geojson.Point;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tga.api.base.BaseService;
import com.tga.api.base.GISElements;
import com.tga.api.base.ODHandler;
import com.tga.api.model.GeometryType;
import com.tga.db.DBUtil;
import com.tga.util.Config;
import com.tga.util.Util;


@Path("/elements")
public class MapElementsService extends BaseService {
	private static final Log LOGGER = LogFactory.getLog("InfoLog");
	
	@GET
	@Path("/nodes")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getNodes(@QueryParam("id") String p_id) throws JSONException, SQLException, JsonProcessingException 
	{
		//check param
		if((p_id == null || p_id.equals(""))) {
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		//pre-process
		p_id = p_id.replaceAll("[\" {}\\n]", "");
		String id_csv[] = p_id.split(",");
		long ids[] = new long[id_csv.length];
		for (int i = 0; i < id_csv.length; ++i) {
			ids[i] = Long.parseLong(id_csv[i]);
		}
		
		FeatureCollection featureCollection = new FeatureCollection();
		for (int i = 0; i < ids.length; ++i) {
			Feature feature = new Feature();
			featureCollection.add(feature);
			GeoJsonObject point = GISElements.getNode(ids[i]);
			feature.setGeometry(point);
		}
		
		ObjectMapper mapper = new ObjectMapper();
		return buildResponse(OK, mapper.writeValueAsString(featureCollection));
	}
	
	@GET
	@Path("/ways")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getWays(@QueryParam("id") String p_id) throws JSONException, SQLException, JsonProcessingException 
	{
		//check param
		if((p_id == null || p_id.equals(""))) {
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		long id = Long.parseLong(p_id);
		FeatureCollection featureCollection = new FeatureCollection();
		Feature feature = new Feature();
		featureCollection.add(feature);
		GeoJsonObject way = GISElements.getWay(id);
		feature.setGeometry(way);
		
		ObjectMapper mapper = new ObjectMapper();
		return buildResponse(OK, mapper.writeValueAsString(featureCollection));
	}
	
	@GET
	@Path("/segments")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getSegments(@QueryParam("id") String p_id) throws JSONException, SQLException, JsonProcessingException 
	{
		//check param
		if((p_id == null || p_id.equals(""))) {
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		//pre-process
		p_id = p_id.replaceAll("[\" {}\\n]", "");
		String id_csv[] = p_id.split(",");
		long ids[] = new long[id_csv.length];
		for (int i = 0; i < id_csv.length; ++i) {
			ids[i] = Long.parseLong(id_csv[i]);
		}
		
		FeatureCollection featureCollection = new FeatureCollection();
		for (int i = 0; i < ids.length; ++i) {
			Feature feature = new Feature();
			featureCollection.add(feature);
			GeoJsonObject segment = GISElements.getSegment(ids[i]);
			feature.setGeometry(segment);
		}
		
		ObjectMapper mapper = new ObjectMapper();
		return buildResponse(OK, mapper.writeValueAsString(featureCollection));
	}
	
	@GET
	@Path("/sections")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getSections(@QueryParam("id") String p_id) throws JSONException, SQLException, JsonProcessingException 
	{
		//check param
		if((p_id == null || p_id.equals(""))) {
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		//pre-process
		p_id = p_id.replaceAll("[\" {}\\n]", "");
		String id_csv[] = p_id.split(",");
		long ids[] = new long[id_csv.length];
		for (int i = 0; i < id_csv.length; ++i) {
			ids[i] = Long.parseLong(id_csv[i]);
		}
		
		FeatureCollection featureCollection = new FeatureCollection();
		for (int i = 0; i < ids.length; ++i) {
			Feature feature = new Feature();
			featureCollection.add(feature);
			GeoJsonObject section = GISElements.getSection(ids[i]);
			feature.setGeometry(section);
		}
		
		ObjectMapper mapper = new ObjectMapper();
		return buildResponse(OK, mapper.writeValueAsString(featureCollection));
	}
	
	@GET
	@Path("/sectionList")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getSectionList(
			@QueryParam("zoom") int p_zoom,
			@QueryParam("left") double p_left,
			@QueryParam("right") double p_right,
			@QueryParam("up") double p_up,
			@QueryParam("down") double p_down ) throws JSONException, SQLException, JsonProcessingException 
	{
		//check param
		if(p_zoom < 14) {
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		FeatureCollection featureCollection = GISElements.getSections(p_left, p_right, p_up, p_down);
		
		ObjectMapper mapper = new ObjectMapper();
		return buildResponse(OK, mapper.writeValueAsString(featureCollection));
	}

	@GET
	@Path("/roadnetwork")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getRoadnetwork(
			@QueryParam("zoom") int p_zoom,
			@QueryParam("left") double p_left,
			@QueryParam("right") double p_right,
			@QueryParam("up") double p_up,
			@QueryParam("down") double p_down ) throws JSONException, SQLException, JsonProcessingException 
	{
		//check param
		if(p_zoom < 14) {
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		JSONObject roadnetwork = GISElements.getRoadnetwork(p_left, p_right, p_up, p_down);
		
		return buildResponse(OK, roadnetwork);
	}
}