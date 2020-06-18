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

package com.google.sps;

import java.util.Collection;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Comparator;
import java.util.Collections;
import java.util.List;
import java.util.Set;

public final class FindMeetingQuery {
  /*This method determines the possible free times that work with the attendees and duration 
  of meeting passed in along with the attendees current events scheduled. If there is a 
  list of times that works with optional and mandatory attendees, that will be returned. 
  If there is not, only the times that work with the mandatory attendees will be returned.*/
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    List<TimeRange> possibleMeeting = new ArrayList<TimeRange>(); //possible meeting times
    ArrayList<Event> eventList = new ArrayList<>(events);
    Collections.sort(eventList, Event.ORDER_BY_START); //sort events passed in chronologically

    //edge case: if not attendees, return whole day
    if (request.getAttendees().isEmpty() && request.getOptionalAttendees().isEmpty()){
        possibleMeeting.add(TimeRange.WHOLE_DAY);
        return possibleMeeting;  
    }

    else {
        ArrayList<String> optionalList = new ArrayList<>(request.getOptionalAttendees()); 
        //optional attendees
        ArrayList<String> mandatoryList = new ArrayList<>(request.getAttendees());
        //mandatory attendees
        ArrayList<TimeRange> blockedOptional = new ArrayList<TimeRange>();
        //not options for times for optional and mandatory attendees
        ArrayList<TimeRange> blockedMandatory = new ArrayList<TimeRange>();
        //not options for times for mandatory attendees
        optionalList.addAll(mandatoryList);
        //combined list of optional and mandatory attendees
        blockedOptional = this.findBlockedTimes(eventList, optionalList);
        blockedMandatory = this.findBlockedTimes(eventList, mandatoryList);
        if (!blockedOptional.isEmpty()){ //there are blocked times for both optional and mandatory
            possibleMeeting = this.freeTimes(blockedOptional, request);
        }
        
        if (possibleMeeting.isEmpty() && !mandatoryList.isEmpty()) {
            //there isn't a valid time for optional attendees and there are mandatory attendees
            possibleMeeting = this.freeTimes(blockedMandatory, request); 
        }

        Collection<TimeRange> possibleTimesCollection = possibleMeeting; //return collection
        return possibleTimesCollection;
        
    }        
            
  }

/*This method will determine the time ranges that do not work for the passed in attendees based on their
current schedule.*/
public ArrayList<TimeRange> findBlockedTimes(ArrayList<Event> eventList, ArrayList<String> attendees){
    ArrayList<TimeRange> blockedTimes = new ArrayList<TimeRange>(); 
    int counter = 1;
    for (int i = 0; i<eventList.size(); i++){ //iterate through event list
        Event currentEvent = eventList.get(i); 
        TimeRange currentEventTime = currentEvent.getWhen();
        Set<String> attendeesSet = currentEvent.getAttendees();
        if (this.eventIncludesAttendee(attendeesSet, attendees) == false){
            //current event attendees aren't listed in attendees passsed in
            counter++;
            continue;
        }
        if (i!=0 && blockedTimes.size()>0 && currentEventTime.start()<=blockedTimes.get(i-counter).end()){
            //events overlap with previuos event added -> compound the events
            int previousStart = blockedTimes.get(i-counter).start();
            TimeRange newRange = TimeRange.fromStartEnd(previousStart, currentEventTime.end(), false);
            if (newRange.duration() > blockedTimes.get(i-counter).duration()){
                blockedTimes.set(i-counter, newRange);
            }
            counter++;
        }
        else{
            blockedTimes.add(currentEventTime);
        }
    }
    return blockedTimes; 
}

/*This method will determine the free times for the attendees based on the meeting request and
when they are all not available.*/
public ArrayList<TimeRange> freeTimes(ArrayList<TimeRange> blocked, MeetingRequest request){
    int time = 0;
    ArrayList<TimeRange> options = new ArrayList<TimeRange>();
    for (int i = 0; i<blocked.size(); i++){ //iterate through blocked off times
        TimeRange add = TimeRange.fromStartEnd(time, blocked.get(i).start(), false);
        time = blocked.get(i).end();
        if (add.duration()>=request.getDuration()){ //if opening time slot long enough
            options.add(add);
        }
    }
    TimeRange finalAdd = TimeRange.fromStartEnd(time, TimeRange.END_OF_DAY, true); //last time slot
    if (finalAdd.duration()>=request.getDuration()){
        options.add(finalAdd);
    }
    return options;
}

/*This method will determine if the current event's attendees are included in the list of attendees
that is being searched on for possible meeting times.*/
public boolean eventIncludesAttendee(Set<String> attendeesSet, ArrayList<String> attendees){
    boolean includeEvent = true; 
    Iterator j = attendeesSet.iterator();
    int hasAttendees = 0; 
    while (j.hasNext()){
        if (attendees.contains(j.next())){
            hasAttendees++;
        }
    }
    if (hasAttendees == 0){
        includeEvent = false; 
    }
    return includeEvent; 
}
}
