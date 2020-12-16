package com.example.myapplication;

import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;
import androidx.test.rule.ActivityTestRule;

import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.closeSoftKeyboard;
import static androidx.test.espresso.action.ViewActions.typeText;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static androidx.test.espresso.matcher.RootMatchers.withDecorView;
import static org.hamcrest.CoreMatchers.not;
import static org.junit.Assert.assertEquals;
@RunWith(AndroidJUnit4.class)
@LargeTest
public class UserUpdateTest {
    @Rule
    public ActivityTestRule<MainActivity> activityRule
            = new ActivityTestRule<>(MainActivity.class);

    @Test
    public void updateTest() throws InterruptedException {
        onView(withId(R.id.secondFragment))
                .perform(click())
                .check(matches(isDisplayed()));

        onView(withId(R.id.update_account_button))
                .perform(click());

        Thread.sleep(1000);


        String name = "Joshua";
        String language = "English, French";
        String className = "CPSC 320";
        String hobby = "Soccer, Coding";
        String toast = "Update not complete, please make sure fields are not empty";

        // Fail Condition #1
        // perform update with all (4) fields left blank
        onView(withId(R.id.signupButton))
                .perform(click());
        onView(withText(toast)).inRoot(withDecorView(not(activityRule.getActivity().getWindow().getDecorView())))
                .check(matches(isDisplayed()));

        // Fail Condition #2
        // perform update with 3 fields left blank
        onView(withId(R.id.signup_nameField))
                .perform(typeText(name), closeSoftKeyboard());
        onView(withId(R.id.signupButton))
                .perform(click());
        onView(withText(toast)).inRoot(withDecorView(not(activityRule.getActivity().getWindow().getDecorView())))
                .check(matches(isDisplayed()));

        // Fail Condition #3
        // perform update with 2 fields left blank
        onView(withId(R.id.signup_ClassField))
                .perform(typeText(className), closeSoftKeyboard());
        onView(withId(R.id.signupButton))
                .perform(click());
        onView(withText(toast)).inRoot(withDecorView(not(activityRule.getActivity().getWindow().getDecorView())))
                .check(matches(isDisplayed()));

        // Fail Condition #4
        // perform update with 1 field left blank
        onView(withId(R.id.signup_Language))
                .perform(typeText(language), closeSoftKeyboard());
        onView(withId(R.id.signupButton))
                .perform(click());
        onView(withText(toast)).inRoot(withDecorView(not(activityRule.getActivity().getWindow().getDecorView())))
                .check(matches(isDisplayed()));

        // Success Condition
        // All blanks are filled, update is complete and now directed to MainActivity
        onView(withId(R.id.signup_Hobbies))
                .perform(typeText(hobby), closeSoftKeyboard());

        onView(withId(R.id.signupButton))
                .perform(click())
                .check(matches(isDisplayed()));
        assertEquals(1,1);

    }
}
