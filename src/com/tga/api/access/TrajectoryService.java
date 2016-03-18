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


@Path("/trajectory")
public class TrajectoryService extends BaseService {
	private static final Log LOGGER = LogFactory.getLog("InfoLog");
	
	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getTrajectory(@QueryParam("id") String p_id) throws JSONException, SQLException, JsonProcessingException 
	{
		//check param
		if((p_id == null || p_id.equals(""))) {
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		long id = Long.parseLong(p_id);
		FeatureCollection featureCollection = new FeatureCollection();
		Feature feature = new Feature();
		featureCollection.add(feature);
		GeoJsonObject way = TrajectoryHandler.getTrajectory(id);
		feature.setGeometry(way);
		
		ObjectMapper mapper = new ObjectMapper();
		return buildResponse(OK, mapper.writeValueAsString(featureCollection));
	}
	
}