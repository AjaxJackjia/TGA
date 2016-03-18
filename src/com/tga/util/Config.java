package com.tga.util;

public class Config {
	public static final String USER_IMG_BASE_DIR = "uploads/users/";
	public static final String PROJECT_IMG_BASE_DIR = "uploads/projects/";
	public static final String PROJECT_FILE_BASE_DIR = "uploads/files/";
	
	//后台的project操作码以及实体码,前端与后台需要统一
	public static enum Action {
		CREATE(100), 	//创建 
		UPDATE(200), 	//修改
		READ(300),		//查询
		DELETE(400),	//删除
		ADD(500),		//加入
		REMOVE(600),	//移除
		LEAVE(700),		//离开
		UPLOAD(800),	//上传
		REPLY(900),		//回复
		APPLY(1000),	//申请
		REJECT(2000),	//拒绝
		AGREE(3000);	//同意
		
		//attributes
		private int code;
		private Action(int code) {
			this.code = code;
		}
		public int getValue() {
			return this.code;
		}
	};
	
	public static enum Entity {
		//项目1-XX
		PROJECT(100),
		PROJECT_TITLE(101),
		PROJECT_ADVISOR(102),
		PROJECT_ABSTRACT(103),
		PROJECT_LOGO(104),
		PROJECT_STATUS(105),
		PROJECT_SECURITY(106),
		//成员2-XX
		MEMEBER(200),
		//里程碑3-XX
		MILESTONE(300),
		MILESTONE_TITLE(301),
		MILESTONE_DESCRIPTION(302),
		//forum topic 4-XX
		TOPIC(400),
		TOPIC_TITLE(401),
		TOPIC_DESCRIPTION(402),
		//话题discussion 5-XX
		MESSAGE(500),
		//文件 6-XX
		FILE(600),
		//project申请 7-XX
		APPLICATION(700);
		
		//attributes
		private int code;
		private Entity(int code) {
			this.code = code;
		}
		public int getValue() {
			return this.code;
		}
	};
	
	public static enum UserType {
		STUDENT(0),
		FACULTY(1),
		INDUSTRICAL_PARTICIPANT(2),
		GOVERNMENT(3),
		OTHERS(4);
			
		//attributes
		private int code;
		private UserType(int code) {
			this.code = code;
		}
		public int getValue() {
			return this.code;
		}
	};
}