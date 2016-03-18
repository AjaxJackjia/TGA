package com.tga.util;

import java.io.IOException;
import java.security.MessageDigest;
import java.util.Properties;
import java.util.Random;

public class Util {
	public static Properties loadProperties(String filename) {
		Properties props = new Properties();
		try {
			//InputStream input = Util.class.getClassLoader().getResourceAsStream(filename);
			ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
			props.load(classLoader.getResourceAsStream(filename));
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return props;
	}
	
	//根据指定长度生成字母和数字的随机数
    //0~9的ASCII为48~57
    //A~Z的ASCII为65~90
    //a~z的ASCII为97~122
	public static String generateRandomString(int strLength) {
		//check length (最长为20，最短为6)
		if(strLength > 20 || strLength < 6) {
			strLength = 6;
		}
		
		//生成随机字符串
		StringBuilder sb = new StringBuilder();
		Random randomCharType = new Random();
		Random randomCharValue = new Random();
		for(int i = 0; i<strLength; i++) {
			int type = randomCharType.nextInt(3);
			switch(type) {
			case 0: //number
				char number = (char) (randomCharValue.nextInt(10) + 48);
				sb.append(number);
				break;
			case 1: //lower case letter
				char lowerCase = (char) (randomCharValue.nextInt(26) + 97);
				sb.append(lowerCase);
				break;
			case 2: //upper case letter
				char upperCase = (char) (randomCharValue.nextInt(26) + 65);
				sb.append(upperCase);
				break;
			}
		}
		
		return sb.toString();
	}
	
	public static String md5(String input) {
		try{
			MessageDigest messageDigest = MessageDigest.getInstance("MD5");
			byte[] inputByteArray = input.getBytes();
			messageDigest.update(inputByteArray);
			byte[] resultByteArray = messageDigest.digest();
			return byteArrayToHex(resultByteArray);
		}catch(Exception ex) {
			ex.printStackTrace();
		}
		
		return null;
	}
	
	private static String byteArrayToHex(byte[] byteArray) {
		char[] hexDigits = {'0','1','2','3','4','5','6','7','8','9', 'a','b','c','d','e','f' };
		char[] resultCharArray = new char[byteArray.length * 2];
		int index = 0;
		for (byte b : byteArray) {
		     resultCharArray[index++] = hexDigits[b>>> 4 & 0xf];
		     resultCharArray[index++] = hexDigits[b& 0xf];
		}
		
		return new String(resultCharArray);
	}
}