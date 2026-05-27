"use client";
import { useState } from "react";
import NotificationBanner from "@/components/notification-banner/NotificationBanner";
import SearchFilter from "@/components/search-filter/SearchFilter";
import PasswordStrength from "@/components/password-strength/PasswordStrength";
import ShoppingCart from "@/components/shopping-cart/ShoppingCart";
import LoginForm from "@/components/user-auth/LoginForm";
import UserSearch from "@/components/user-search/UserSearch";

const sampleItems = [
  { id: 1, name: "React Handbook", category: "books" },
  { id: 2, name: "TypeScript Guide", category: "books" },
  { id: 3, name: "Node.js Course", category: "courses" },
  { id: 4, name: "CSS Masterclass", category: "courses" },
  { id: 5, name: "VS Code", category: "tools" },
];

export default function Home() {
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "warning" | "info";
    message: string;
  } | null>({ type: "info", message: "Welcome to the testing playground!" });

  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white p-8">
      {/* <main className="max-w-4xl mx-auto flex flex-col gap-12">
        <h1 className="text-3xl font-bold text-black">
          Production Testing Playground
        </h1>
        <section className="border border-zinc-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-black">
            Notification Banner
          </h2>
          <div className="flex gap-2 mb-4">
            <button
              className="px-3 py-1 bg-green-100 text-green-800 rounded"
              onClick={() =>
                setNotification({ type: "success", message: "Operation successful!" })
              }
            >
              Success
            </button>
            <button
              className="px-3 py-1 bg-red-100 text-red-800 rounded"
              onClick={() =>
                setNotification({ type: "error", message: "Something went wrong!" })
              }
            >
              Error
            </button>
            <button
              className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded"
              onClick={() =>
                setNotification({ type: "warning", message: "Proceed with caution!" })
              }
            >
              Warning
            </button>
          </div>
          {notification && (
            <NotificationBanner
              type={notification.type}
              message={notification.message}
              dismissible
              onDismiss={() => setNotification(null)}
            />
          )}
        </section>
        <section className="border border-zinc-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-black ">
            Search & Filter
          </h2>
          <SearchFilter items={sampleItems} />
        </section>
        <section className="border border-zinc-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-black ">
            Password Strength Checker
          </h2>
          <PasswordStrength />
        </section>
        <section className="border border-zinc-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-black ">
            Shopping Cart
          </h2>
          <ShoppingCart />
        </section>
        <section className="border border-zinc-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-black ">
            User Authentication
          </h2>
          {loggedInUser ? (
            <p className="text-green-600">Welcome, {loggedInUser}!</p>
          ) : (
            <LoginForm
              onSuccess={(token, userName) => setLoggedInUser(userName)}
            />
          )}
        </section>
      </main> */}

      {/* 
      
      
      I don't know the syntax of writing test cases , but I can pretty much tell what to do. So write down test cases according to exactly what I tell. 
      No refinements , no improvisations.


      Define a mock data of users of 10 ( no of it containing concecutive "ww" letter on their first or last name or email )

      in this format : export type User = {
          id: number;
          name: string;
          email: string;
          phone: string;
        };

      1. 
        - describe ( "checking the initial state of the component")
        - setup the global fetch catching mocking & return the mock data 
        - Render the <UserSearch /> , 
          - there should be a text of  "10 users found" present on the screen.
          - grab the ul element & there should be 10 users displayed on the screen
          
          
          2. 
          - describe ("checking the filtering logic")
          - setup the global fetch catching mocking & return the mock data 
          - Render the <UserSearch /> , 
          - grab the ul element , type "le" via the userevent and the all users listed on the screen must contains/includes the letter "le"  on their names or emails.
          
          
          3. 
          - describe ("Matches the condition for user not found on filtering logic")
          - setup the global fetch catching mocking & return the mock data 
          - Render the <UserSearch /> , 
            - grab the ul element , type "ww" via the userevent and the screen must contain "No users found matching “ww”" this text
            - there must be a text of  "0 users found" present on the screen.
        
          


this is the test cases I figured out for this UserSearch.tsx component , Now implement it inside `user-search.test.tsx` file

      
      */}

      <UserSearch />
    </div>
  );
}


