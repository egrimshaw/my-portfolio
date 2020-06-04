package com.google.sps.data;

/** An item on a todo list. */
public final class Comment {

  private final long id;
  private final String comment;
  private final long time;

  public Comment(long id, String commentAdd, long timestamp) {
    this.id = id;
    this.comment = commentAdd;
    this.time = timestamp;
  }
}