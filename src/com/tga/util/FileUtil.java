package com.tga.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLDecoder;
import java.security.MessageDigest;

import org.apache.log4j.Logger;

public class FileUtil {
	private static final Logger LOGGER = Logger.getLogger(FileUtil.class);
	
	public static boolean create(InputStream fileInputStream, String filenameWithPath) {
	    int read = 0;
	    byte[] bytes = new byte[1024];
	    try {
	    	//step 1. 判断是否存在项目目录；若不存在,则建立目录
	    	File file = new File(filenameWithPath);
	    	if(!file.getParentFile().exists()) {
	    		file.getParentFile().mkdirs();
	    	}
	    	//step 2. 将文件写入磁盘；若文件已存在，则强制写入
			OutputStream outpuStream = new FileOutputStream(file);
		    while ((read = fileInputStream.read(bytes)) != -1) {
		    	 outpuStream.write(bytes, 0, read);
		    }
		    outpuStream.flush();
		    outpuStream.close();
		    
		    return true;
	    }catch(Exception ex) {
	    	ex.printStackTrace();
	    	//log
	    	
	    	return false;
	    }
	}
	
	public static void delete(String filenameWithPath) {
		File file = new File(filenameWithPath);     
        if(file.isFile() && file.exists()){     
            file.delete();
        }
	}
}