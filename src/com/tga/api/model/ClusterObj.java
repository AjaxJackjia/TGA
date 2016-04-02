package com.tga.api.model;

import java.util.ArrayList;
import java.util.Comparator;

import com.tga.util.Util;

public class ClusterObj {
	private String id;
	//basic info
	private double lng;
	private double lat;
	
	//properties
	private int cluster;
	private boolean isVisited;
	
	private double coreDis;
	private double reachabilityDis;
	private ArrayList<String> N_epsilon;
	
	public static Comparator<ClusterObj> clusterComparator = new Comparator<ClusterObj>() {
		@Override
		public int compare(ClusterObj o1, ClusterObj o2) {
			if (o1.getReachabilityDis() > o2.getReachabilityDis())
				return 1;
			if (o1.getReachabilityDis() == o2.getReachabilityDis())
				return 0;
			return -1;
		}
	};
	
	public ClusterObj(double lng, double lat) {
		this.id = Util.md5(String.valueOf(System.currentTimeMillis()) + String.valueOf(lng + lat));
		this.lng = lng;
		this.lat = lat;
		
		this.coreDis = -1;
		this.reachabilityDis = -1;
		this.cluster = -1;
		this.isVisited = false;
		this.N_epsilon = new ArrayList<String>();
	}

	public String getId() {
		return id;
	}

	public double getLng() {
		return lng;
	}

	public void setLng(double lng) {
		this.lng = lng;
	}

	public double getLat() {
		return lat;
	}

	public void setLat(double lat) {
		this.lat = lat;
	}

	public int getCluster() {
		return cluster;
	}

	public void setCluster(int cluster) {
		this.cluster = cluster;
	}

	public boolean isVisited() {
		return isVisited;
	}

	public void setVisited(boolean isVisited) {
		this.isVisited = isVisited;
	}

	public double getCoreDis() {
		return coreDis;
	}

	public void setCoreDis(double coreDis) {
		this.coreDis = coreDis;
	}

	public double getReachabilityDis() {
		return reachabilityDis;
	}

	public void setReachabilityDis(double reachabilityDis) {
		this.reachabilityDis = reachabilityDis;
	}

	public ArrayList<String> getN_epsilon() {
		return N_epsilon;
	}

	public void setN_epsilon(ArrayList<String> n_epsilon) {
		N_epsilon = n_epsilon;
	}
	
	public boolean isEqual(ClusterObj obj) {
		return this.lat == obj.lat && this.lng == obj.lng;
	}
	
	public void display() {
		System.out.println("--------------" + this.id + "--------------------");
		System.out.println(lng + ", " + lat);
		System.out.println("cluster: " + this.cluster);
		System.out.println("isVisited: " + this.isVisited);
		System.out.println("coreDis: " + this.coreDis);
		System.out.println("reachabilityDis: " + this.reachabilityDis);
		System.out.println("N_epsilon: " + this.N_epsilon.toString());
	}
}
