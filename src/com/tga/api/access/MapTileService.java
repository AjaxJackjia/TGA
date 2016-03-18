package com.tga.api.access;

import java.awt.image.BufferedImage;
import java.io.File;

import javax.imageio.ImageIO;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

import com.tga.api.base.BaseService;

@Path("/img")
public class MapTileService extends BaseService {
	@Context private HttpServletRequest request;
	@Context private HttpServletResponse response;
	
	@GET
	@Path("/{z}/{x}/{y}")
	@Produces("image/png")
	public Response getMapImage(
			@PathParam("z") String p_z,
			@PathParam("x") String p_x,
			@PathParam("y") String p_y )throws Exception
	{
		String baseDir = getWebAppAbsolutePath();
		String imgDir = baseDir + "res/images/common/empty.png";
		File imgFile = new File(imgDir);
		
		BufferedImage image = ImageIO.read(imgFile);
		ServletOutputStream out = response.getOutputStream();
		ImageIO.write(image, "png", out);
		out.close();
		return null;
	}
}