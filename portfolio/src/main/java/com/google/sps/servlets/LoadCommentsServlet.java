// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import com.google.gson.Gson;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.sps.data.Comment;
import java.util.List;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;


/** Servlet that loads some comments content. */
@WebServlet("/load")
public class LoadCommentsServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    int numberComments = -1;
    try{
     numberComments = Integer.parseInt(request.getParameter("numComments"));
    }
    catch(NumberFormatException e){
        numberComments=1;
    }

    Query query = new Query("Comments").addSort("time", SortDirection.DESCENDING); // most recent comments first
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);

    List<Comment> commentsArray = new ArrayList<>();
    for (Entity entity: results.asList(FetchOptions.Builder.withLimit(numberComments))) {
      long id = entity.getKey().getId();
      String title = (String) entity.getProperty("comment");
      String name = (String) entity.getProperty("commentName");
      long timestamp = (long) entity.getProperty("time");
      Comment commentToAdd = new Comment(id, title, name, timestamp);
      commentsArray.add(commentToAdd);
      
    }

    Gson gson = new Gson();
    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(commentsArray));

  }
}
