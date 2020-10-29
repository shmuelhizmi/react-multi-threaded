<h1 align="center">
  React Multi-Threaded
</h1>
<p align="center">
  create FAST multi-threaded React Apps - one App two threads
</p>

## What is "React Multi-Threaded"
"React Multi-Threaded" is a typescript framework that lets you transform your existing/new React-App from a single-threaded Web-App into a multi-threaded faster Web-App.
## How does it work?
In "React Multi-Threaded" you have two different types of components
 - UI Component - UI Components are components that run on the main thread since every interaction with the dom must be fired from the main thread.
 - Layout/Logic Component - Layout/Logic-Components are components that run on the web-worker thread they are used for data fetching, logic, and layouts.
with "React Multi-Threaded" you can build your app from a mix of those two types of components and "React Multi-Threaded" will separate them into
one UI thread with your UI Components and one business logic web-worker thread with your Layout/Logic Components

