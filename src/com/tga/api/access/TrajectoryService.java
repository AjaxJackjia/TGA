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
import com.tga.api.base.TrajectoryHandler;
import com.tga.api.model.GeometryType;
import com.tga.db.DBUtil;
import com.tga.util.Config;
import com.tga.util.Util;


@Path("/trajectories")
public class TrajectoryService extends BaseService {
	private static final Log LOGGER = LogFactory.getLog("InfoLog");
	
	@GET
	@Path("/{tripId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getTrajectory(@PathParam("tripId") String p_id) throws JSONException, SQLException, JsonProcessingException 
	{
		//check param
		if((p_id == null || p_id.equals(""))) {
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		long id = Long.parseLong(p_id);
		JSONObject result = new JSONObject();
		ObjectMapper mapper = new ObjectMapper();
		
		//gps data
		FeatureCollection gpsFeatureCollection = TrajectoryHandler.getRawGPS(id);
		result.put("gpsData", mapper.writeValueAsString(gpsFeatureCollection));
		
		//assign data
		FeatureCollection assignFeatureCollection = TrajectoryHandler.getAssign(id);
		result.put("assignData", mapper.writeValueAsString(assignFeatureCollection));
		
		//augment data
		FeatureCollection augmentFeatureCollection = TrajectoryHandler.getAugment(id);
		result.put("augmentData", mapper.writeValueAsString(augmentFeatureCollection));
		
		return buildResponse(OK, result);
	}
	
	@GET
	@Path("/motivation")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getMotivation(
			@QueryParam("o_lng") double p_o_lng,
			@QueryParam("o_lat") double p_o_lat, 
			@QueryParam("d_lng") double p_d_lng,
			@QueryParam("d_lat") double p_d_lat,
			@QueryParam("path") String p_path ) throws JSONException, SQLException, JsonProcessingException 
	{
		String[] ids_str = p_path.split(",");
		JSONObject result = new JSONObject();
		ObjectMapper mapper = new ObjectMapper();
		
		//od
		JSONObject o = new JSONObject();
		o.put("lng", p_o_lng);
		o.put("lat", p_o_lat);
		JSONObject d = new JSONObject();
		d.put("lng", p_d_lng);
		d.put("lat", p_d_lat);
		
		//path
		FeatureCollection path = new FeatureCollection();
		for(String id : ids_str) {
			Feature feature = new Feature();
			GeoJsonObject section = GISElements.getSection(Long.parseLong(id));
			feature.setGeometry(section);
			
			path.add(feature);
		}
		
		result.put("o", o);
		result.put("d", d);
		result.put("path", mapper.writeValueAsString(path));
		
		return buildResponse(OK, result);
	}
}