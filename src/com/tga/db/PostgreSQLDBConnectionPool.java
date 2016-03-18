package com.tga.db;

import java.sql.Connection;

import javax.naming.InitialContext;
import javax.sql.DataSource;

public class PostgreSQLDBConnectionPool extends DBConnectionPool
{
    @Override
    public Connection getConnection() throws Exception
    {
        InitialContext ctx = new InitialContext();
        DataSource ds = (DataSource) ctx.lookup("java:comp/env/jdbc/postgresql");
        return ds.getConnection();
    }

    @Override
    public void putBackConnection(Connection conn) throws Exception
    {
    	if (conn != null && !conn.isClosed()) {
			conn.close();
		}
    }
}