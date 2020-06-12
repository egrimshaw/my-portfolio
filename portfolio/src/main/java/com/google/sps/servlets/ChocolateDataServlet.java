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
import com.google.sps.data.Comment;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that creates votes. */
@WebServlet("/chocolateData")
public class ChocolateDataServlet extends HttpServlet {
  private Map<String, Long> chocolateVotes = new HashMap<>();
  private DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Query query = new Query("Chocolate");
    PreparedQuery results = datastore.prepare(query);

    for (Entity entity : results.asIterable()) {
      String type = (String) entity.getProperty("chocolateType");
      long voteCount = (long) entity.getProperty("vote");
      chocolateVotes.put(type, voteCount);
    }

    Gson gson = new Gson();
    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(chocolateVotes));
    // response.setContentType("application/jason; ");
    // Gson gson = new Gson();
    // String json = gson.toJson(chocolateVotes);
    // response.getWriter().println(json);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String chocolate = request.getParameter("chocolate");
    long timestamp = System.currentTimeMillis();
    long currentVotes = 0;

    Query query = new Query("Chocolate")
                      .setFilter(new Query.FilterPredicate(
                          "chocolateType", Query.FilterOperator.EQUAL, chocolate));
    query.addSort("time", SortDirection.DESCENDING); // get most recent vote count
    PreparedQuery results = datastore.prepare(query);
    Iterator<Entity> resultsList = results.asIterator();
    Entity entity = null;
    if (resultsList.hasNext()) {
      entity = resultsList.next();
    }
    if (entity == null) {
      System.out.println("null");
      currentVotes = 1;
    } else {
      System.out.println("not null");
      currentVotes = (long) entity.getProperty("vote") + 1;
    }

    chocolateVotes.put(chocolate, currentVotes);

    Entity chocolateEntity = new Entity("Chocolate");
    chocolateEntity.setProperty("chocolateType", chocolate);
    chocolateEntity.setProperty("vote", currentVotes);
    chocolateEntity.setProperty("time", timestamp);

    datastore.put(chocolateEntity);

    response.sendRedirect("/chart.html");
  }
}
