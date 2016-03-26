package com.tga.api.algorithm;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;

import org.codehaus.jettison.json.JSONArray;

import net.sf.json.JSONObject;

public class OnlineDetection {
	/**
	 * 在线检测数据：
		OD:
		114.11413192749022,22.53356721100715#114.09468054771423,22.565036973126222
		
		GPS points:
		114.11451816558838,22.53394378080202#114.11329507827759,22.53564824176713#114.11213636398315,22.537412138519713#114.11166429519653,22.540186761964755#114.11123514175415,22.542763148088515#114.11170721054077,22.545478210654643#114.11391735076904,22.54579529477059#114.11640644073486,22.546231284240516#114.11665320396423,22.548966095861147#114.11752223968506,22.55160176881466#114.11872386932373,22.553741977479913#114.12011861801147,22.555783071479265#114.12132024765015,22.55701167660745#114.12104129791258,22.558220454844044#114.12020444869995,22.559429222487182#114.11885261535645,22.558993274722493#114.1164708137512,22.558735668577487#114.11374568939209,22.558696036820166#114.1098403930664,22.558676220937233#114.10627841949461,22.558814932057963#114.10155773162842,22.558735668577487#114.09632205963135,22.558894195492893#114.09464836120605,22.559647195852783#114.09464836120605,22.562698786797835#114.09464836120605,22.564601043088928
		
		Cur Atr:
		15359,40857,40858,1425,1426,1427,1428,1429,34423,34443,34444,34445,34699,34700,34701,34702,34703,34704,34705,1571,1572,1573,1574,1575,1576,1577,1578,2463,2464,2465,42953,3504,3505,3506,3507,3508,3509,3510,2962,2963,2966,18162,18165,18166,18137,18138,18139,18140,18141,18142,18143,18144,18145,18146,18147,35624,16826,16827,16828,16829,16830,16831,16832,16833,16834,16835
		
		Rec Atrs:
		#1: 15359,40857,40858,1425,1426,1427,1428,1429,34423,34424,34425,34426,34435,34427,34428,34429,2977,2978,2979,2981,2982,2983,2984,2960,2961,3511,2962,2963,2966,18162,18165,18166,18137,18138,18139,18140,18141,18142,18143,18144,18145,18146,18147,35624,16826,16827,16828,16829,16830,16831,16832,16833,16834,16835
		
		#2: 
		34430,15339,40200,15346,35517,35518,10469,10468,17705,17704,24607,1197,1191,1192,1193,17865,34722,17864,37928,37929,2745,2746,2747,2748,2749,2750,2751,2752,2753,2754,2756,29795,29796,29797,18145,18146,18147,35624,16826,16827,16828,16829,16830,16831,16832,16833,16834,16835
		
		#3: 
		15359,40857,40858,1425,1426,1427,1428,1429,34423,34424,34425,34426,34435,34427,34428,34429,2977,2978,2979,2981,2982,2983,2984,2960,2961,3511,2962,2963,2966,18162,18165,18166,18137,18138,18139,18140,18141,18142,18143,18144,29798,29799,29800,29801,29802,29803,16814,16815,16816,16817,16818,16835
		
		#4:
		15359,40857,40858,1425,1426,1427,1428,1429,34423,34424,34425,34426,34435,34427,34428,34429,2977,2978,2979,2981,2982,2983,2984,2985,2986,2968,18046,18047,18048,18045,18034,18035,18036,18037,18038,18039,18040,18041,18041,18042,18043,18044,3094,3150,3151,3108,3153,3123,3124,35704,35692,35693,35694,35695,35696,35697,16837,16836,16835
		
		#5:
		34430,15339,40200,15346,2947,2948,1201,3209,324,325,326,29778,29779,29780,27824,3542,27832,27833,27834,27835,3172,3167,3163,3157,18024,18038,18039,18040,18041,18041,18042,18043,18044,3094,3150,3151,3108,3153,3123,3124,35704,35692,35693,35694,35695,35696,35697,16837,16836,16835
		
		#6:
		15359,40857,40858,1375,1376,1377,1378,1379,1380,1381,1382,24612,24613,24614,34422,34423,34424,34425,34426,34435,34427,34428,34429,2977,2978,2979,2981,2982,2983,2984,2960,2961,3511,2962,2963,2966,18162,18165,18166,18137,18138,18139,18140,18141,18142,18143,18144,18145,18146,18147,35624,16826,16827,16828,16829,16830,16831,16832,16833,16834,16835
		
		#7:
		15359,40857,40858,1375,1376,1377,1378,1379,1380,1381,1382,1383,1384,1385,40512,40513,40514,34491,34492,34489,34429,2977,2978,2979,2981,2982,2983,2984,2960,2961,3511,2962,2963,2966,18162,18165,18166,18137,18138,18139,18140,18141,18142,18143,18144,18145,18146,18147,35624,16826,16827,16828,16829,16830,16831,16832,16833,16834,16835

	 * **/
	
	public static ArrayList<Long> getIdList(String ids) {
		ArrayList<Long> idArray = new ArrayList<Long>();
		String[] ids_split = ids.split(",");
		for(String id : ids_split) {
			idArray.add(Long.parseLong(id));
		}
		return idArray;
	}
	
	public static JSONArray calcuateAnamolyScore(ArrayList<Long> assigned_cur_atr, ArrayList<Long> augmented_cur_atr, ArrayList<ArrayList<Long>> rec_atrs) {
		JSONArray result = new JSONArray();
		
		double previousEnhancedScore = 0;
		double tao = 0.43729;
		for(int index = 0; index < assigned_cur_atr.size(); index++) {
			//current section
			Long section = assigned_cur_atr.get(index);
			int index_in_augment_atr = findIndex(augmented_cur_atr, section);
			
			ArrayList<Long> cur_atr = extractCurrentAtr(augmented_cur_atr, index_in_augment_atr);
			
			//calculate anomaly score
			double score = 1 - calculateAnamolyScore(cur_atr, rec_atrs);
			double enhancedScore = 0;
			if(index == 0) {
				enhancedScore = score;
			}else{
				enhancedScore = (1 - tao) * score + tao * previousEnhancedScore;
			}
			
			//display
			System.out.println(index + " " + score + " " + enhancedScore);
			
			JSONObject obj = new JSONObject();
			obj.put("gps_index", index);
			obj.put("section_index", index_in_augment_atr);
			obj.put("score", score);
			obj.put("enhaned_score", enhancedScore);
			result.put(obj);
			
			previousEnhancedScore = enhancedScore;
		}
		
		return result;
	}
	
	private static double calculateAnamolyScore(ArrayList<Long> cur_atr, ArrayList<ArrayList<Long>> rec_atrs) {
		double max_lcs = 0;
//		System.out.println("LCS value: ");
		for(ArrayList<Long> atr : rec_atrs) {
			double lcs = LCS(cur_atr, atr) / cur_atr.size();
			if(max_lcs < lcs) {
				max_lcs = lcs;
			}
			
//			System.out.println("-----------");
//			System.out.println(cur_atr.toString());
//			System.out.println(atr.toString());
//			System.out.println(lcs + " / " + cur_atr.size());
		}
//		System.out.println();
		
		return max_lcs;
	}
	
	private static double calculateEnhancedAnamolyScore(ArrayList<Long> cur_atr, ArrayList<ArrayList<Long>> rec_atrs, ArrayList<Long> history) {
		double max_lcs = 0;
		
		return max_lcs;
	}
	
	//DP
	private static double LCS(ArrayList<Long> cur_atr, ArrayList<Long> rec_atr) {
		Long[][] matrix = new Long[cur_atr.size()+1][rec_atr.size()+1];
		for(int i = 0; i <= cur_atr.size(); i++) {
			for(int j = 0; j <= rec_atr.size(); j++) {
				matrix[i][j] = new Long(0L);
			}
		}
		
		for(int i = 1; i <= cur_atr.size(); i++) {
			for(int j = 1; j <= rec_atr.size(); j++) {
				if(cur_atr.get(i-1).equals(rec_atr.get(j-1))) {
					matrix[i][j] = (i == 0 && j == 0) ? 0 : matrix[i-1][j-1] + 1;
				}else if(matrix[i][j-1] >= matrix[i-1][j]) {
					matrix[i][j] = matrix[i][j-1];
				}else{
					matrix[i][j] = matrix[i-1][j];
				}
			}
		}
		return matrix[cur_atr.size()][rec_atr.size()];
	}
	
	private static void display(Long[][] matrix) {
		for(int i = 0; i < matrix.length; i++) {
			for(int j = 0; j < matrix[0].length; j++) {
				System.out.print(matrix[i][j] + " ");
			}
			System.out.println();
		}
	}
	
	private static ArrayList<Long> extractCurrentAtr(ArrayList<Long> cur_atr, int currentSectionIndex) {
		ArrayList<Long> sections = new ArrayList<Long>();
		for(int index = 0; index <= currentSectionIndex; index++) {
			sections.add(cur_atr.get(index));
		}
		return sections;
	}
	
	private static int findIndex(ArrayList<Long> list, Long value) {
		for(int i = 0; i < list.size(); i++) {
			if(value.equals(list.get(i))) {
				return i;
			}
		}
		return -1;
	}
}
