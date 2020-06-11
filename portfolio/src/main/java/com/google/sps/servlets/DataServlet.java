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

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that loads and saves comments. */
@WebServlet("/data")
public class DataServlet extends HttpServlet {
  private List<String> commentArray = new ArrayList<String>();
  private UserService userService = UserServiceFactory.getUserService();
  private DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Gson gson = new Gson();
    String jsonArray = gson.toJson(commentArray);
    response.setContentType("application/json; ");
    response.getWriter().println(jsonArray);
  }

  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String comment = request.getParameter("viewer-comment");
    long timestamp = System.currentTimeMillis();
    String name = null;

    if (userService.getCurrentUser() != null) { // if someone is logged in
      Query query = new Query("Comments")
                        .setFilter(new Query.FilterPredicate("id", Query.FilterOperator.EQUAL,
                            userService.getCurrentUser().getUserId()));
      PreparedQuery results = datastore.prepare(query);
      Iterator<Entity> resultsList = results.asIterator();
      if (resultsList.hasNext()){
        Entity entity = resultsList.next();
        name = (String) entity.getProperty("commentName"); //get user name
      }
    }

    Entity commentEntity = new Entity("Comments");

    if (comment != null
        && !comment.equals("")) { // only add comment to entity list if there is text in comment
      commentEntity.setProperty("comment", comment);
      commentEntity.setProperty("commentName", name);
      commentEntity.setProperty("time", timestamp);
      datastore.put(commentEntity);
    }
    response.sendRedirect("/commentform.html");
  }
}
