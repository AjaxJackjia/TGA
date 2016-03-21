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
import com.tga.api.base.TrajectoryHandler;
import com.tga.api.model.GeometryType;
import com.tga.db.DBUtil;
import com.tga.util.Config;
import com.tga.util.Util;


@Path("/od")
public class ODService extends BaseService {
	private static final Log LOGGER = LogFactory.getLog("InfoLog");
	
	@GET
	@Path("/heatmap")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getHeatmapData(
			@QueryParam("zoom") int p_zoom,
			@QueryParam("type") int p_type, // 0 stands for O, 1 stands for D
			@QueryParam("left") double p_left,
			@QueryParam("right") double p_right,
			@QueryParam("up") double p_up,
			@QueryParam("down") double p_down) throws JSONException, SQLException, JsonProcessingException 
	{
		//check param
		if(p_left <= 0 || p_right <= 0 || p_up <= 0 || p_down <= 0) {
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		if(p_zoom < 12 || p_zoom > 18 ) {
			p_zoom = 12;
		}
		
		/*
		 * handle
		 * */
		final int GRID_ZOOM_LEVEL = 13;
		JSONArray result = ODHandler.getOriginalODData(p_type, p_left, p_right, p_up, p_down);
		
		return buildResponse(OK, result);
	}
	
	@GET
	@Path("/trajectory")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getTrajectoryData(
			@QueryParam("o_lng") double p_o_lng,
			@QueryParam("o_lat") double p_o_lat,
			@QueryParam("d_lng") double p_d_lng,
			@QueryParam("d_lat") double p_d_lat,
			@QueryParam("radius") int p_radius, // unit is meter
			@QueryParam("limit") int p_limit,
			@QueryParam("is_across") boolean p_isAcross) throws JSONException, SQLException, JsonProcessingException 
	{
		Point O = new Point(p_o_lng, p_o_lat);
		Point D = new Point(p_d_lng, p_d_lat);
		// not across
		FeatureCollection featureCollection = ODHandler.getTrajectoriesByOD(O, D, p_radius, p_limit);
		
		ObjectMapper mapper = new ObjectMapper();
		return buildResponse(OK, mapper.writeValueAsString(featureCollection));
	}
}