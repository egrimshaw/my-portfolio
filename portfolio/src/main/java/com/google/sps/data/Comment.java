package com.google.sps.data;

/** An item on the comment list. */
public final class Comment {
  private final long id;
  private final String comment;
  private final long time;
  private final String commentName;

  public Comment(long id, String commentAdd, String commentNameAdd, long timestamp) {
    this.id = id;
    this.comment = commentAdd;
    this.commentName = commentNameAdd;
    this.time = timestamp;
    }
}
