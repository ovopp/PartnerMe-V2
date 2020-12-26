package com.example.myapplication;

import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.DiffUtil;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.LinearInterpolator;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.example.myapplication.cardstack.CardStackAdapter;
import com.example.myapplication.cardstack.CardStackCallback;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.gson.Gson;
import com.yuyakaido.android.cardstackview.CardStackLayoutManager;
import com.yuyakaido.android.cardstackview.CardStackListener;
import com.yuyakaido.android.cardstackview.CardStackView;
import com.yuyakaido.android.cardstackview.Direction;
import com.yuyakaido.android.cardstackview.StackFrom;
import com.yuyakaido.android.cardstackview.SwipeableMethod;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;


public class CardViewFragment extends Fragment {

    private CardStackAdapter adapter;
    private CardStackLayoutManager manager;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View root = inflater.inflate(R.layout.fragment_first, container, false);
        render(root);
        return root;
    }

    private void render(View root) {
        final String TAG = "card";
        final String TAG1 = "carddd";
        CardStackView cv = root.findViewById(R.id.card_stack_view);
        manager = new CardStackLayoutManager(getContext(), new CardStackListener() {
            @Override
            public void onCardDragging(Direction direction, float ratio) {
                Log.d(TAG, "onCardDragging: d=" + direction.name() + " ratio=" + ratio);
            }

            @Override
            public void onCardSwiped(Direction direction) {
                Log.d(TAG1, "onCardSwiped: n=" + manager.getTopPosition() + " d=" + direction);
                if (direction == Direction.Right){
                    Toast.makeText(getContext(), "Direction Right", Toast.LENGTH_SHORT).show();
//                    User user = adapter.getItems().get(2);
//                    Log.d(TAG1, user.getEmail());

                    try {
                        User user = adapter.getItems().get(manager.getTopPosition() - 1);
                        Log.d(TAG1, String.valueOf(manager.getTopPosition()));

                        String otherUser = user.getEmail();
                        Log.d(TAG1, otherUser);
//                        String token = user.getToken();
//                        if (user.getToken() == null) {
//                            Log.d(TAG1, "token is null");
//                        } else {
//                            Log.d(TAG1, user.getToken());
                        // TODO: Add token from FB
                            sendMatch(otherUser, "test");
                        // }
                    } catch (Exception e) {
                        System.out.println(e);
                    }

                }
                if (direction == Direction.Top){
                    Toast.makeText(getContext(), "Direction Top", Toast.LENGTH_SHORT).show();
                }
                if (direction == Direction.Left){
                    Toast.makeText(getContext(), "Direction Left", Toast.LENGTH_SHORT).show();
                }
                if (direction == Direction.Bottom){
                    Toast.makeText(getContext(), "Direction Bottom", Toast.LENGTH_SHORT).show();
                }

                // change the value of adapter.getItemcount() - value to how many cards we want before we restart matches
                if (manager.getTopPosition() == adapter.getItemCount()) {
                    page();
                }

            }

            @Override
            public void onCardRewound() {
                Log.d(TAG, "onCardRewound: " + manager.getTopPosition());
            }

            @Override
            public void onCardCanceled() {
                Log.d(TAG, "onCardCanceled: " + manager.getTopPosition());
            }

            @Override
            public void onCardAppeared(View view, int position) {
                TextView tv = view.findViewById(R.id.item_name);
                Log.d(TAG, "onCardAppeared: " + position + ", name: " + tv.getText());
            }

            @Override
            public void onCardDisappeared(View view, int position) {
                TextView tv = view.findViewById(R.id.item_name);
                Log.d(TAG, "onCardDisappeared: " + position + ", name: " + tv.getText());
            }
        });
        manager.setStackFrom(StackFrom.None);
        manager.setVisibleCount(3);
        manager.setTranslationInterval(8.0f);
        manager.setScaleInterval(0.95f);
        manager.setSwipeThreshold(0.3f);
        manager.setMaxDegree(20.0f);
        manager.setDirections(Direction.FREEDOM);
        manager.setCanScrollHorizontal(true);
        manager.setSwipeableMethod(SwipeableMethod.Manual);
        manager.setOverlayInterpolator(new LinearInterpolator());
        adapter = new CardStackAdapter(new ArrayList<User>());
        Log.d(TAG, "got here");
        addList();
        Log.d(TAG, "got here wow");
        cv.setLayoutManager(manager);
        cv.setAdapter(adapter);
        cv.setItemAnimator(new DefaultItemAnimator());
    }



    private void page() {
        addList();
    }

    private void addList() {
        final JSONObject object = new JSONObject();
        GoogleSignInAccount acct = GoogleSignIn.getLastSignedInAccount(getContext());
        if (acct != null) {
            try {
                object.put("email", acct.getEmail());
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        final Gson g = new Gson();
        final RequestQueue queue = Volley.newRequestQueue(this.getContext());
        String url = "http://52.91.172.94:3000/matching/getmatch";
        final JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url, object,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        List<User> userList = new ArrayList<>();
                        JsonResults.MatchResult[] matchList = new JsonResults.MatchResult[0];
                        try {
                            matchList = g.fromJson(response.get("match result").toString(), JsonResults.MatchResult[].class);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        for (JsonResults.MatchResult user : matchList) {
                            userList.add(user.getUser());
                        }
                        List<User> old = adapter.getItems();
                        CardStackCallback callback = new CardStackCallback(old, (userList));
                        DiffUtil.DiffResult result = DiffUtil.calculateDiff(callback);
                        adapter.setItems((userList));
                        result.dispatchUpdatesTo(adapter);
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                System.out.println(error);
            }
        });

        queue.add(jsonObjectRequest);
    }

    private void sendMatch(final String otherUser, final String token) {

        GoogleSignInAccount acct = GoogleSignIn.getLastSignedInAccount(getContext());
        final String currentUser = acct.getEmail();

        final String TAG = "MATCH";
        Log.d(TAG, currentUser);
        Log.d(TAG, otherUser);
        Log.d(TAG, token);

        final RequestQueue requestQueue = Volley.newRequestQueue(this.getContext());
        final String url = getResources().getString(R.string.pushnotif);
        final JSONObject object = new JSONObject();

        try {
            object.put("currentUser", currentUser);
            object.put("otherUser", otherUser);
            // TODO: Fix the token with my own FB token
            object.put("token", token);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        final JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url, object,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        Log.d(TAG, "success");
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                System.out.println(error.toString());
                Log.d("MATCH ERROR", error.toString());
            }
        });

        requestQueue.add(jsonObjectRequest);
    }
}