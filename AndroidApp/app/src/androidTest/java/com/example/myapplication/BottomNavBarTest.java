package com.example.myapplication;

import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;

import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static org.junit.Assert.assertEquals;

@RunWith(AndroidJUnit4.class)
@LargeTest
public class BottomNavBarTest {
    @Rule
    public ActivityScenarioRule<MainActivity> activityRule
            = new ActivityScenarioRule<>(MainActivity.class);

    @Test
    public void firstFragment() {
        onView(withId(R.id.firstFragment)).check(matches(isDisplayed()));
        assertEquals(1,1);
    }

    @Test
    public void changeFragment() {
        onView(withId(R.id.secondFragment))
                .perform(click())
                .check(matches(isDisplayed()));
        onView(withId(R.id.firstFragment))
                .perform(click())
                .check(matches(isDisplayed()));
        onView(withId(R.id.thirdFragment))
                .perform(click())
                .check(matches(isDisplayed()));
        assertEquals(1,1);
    }

}
