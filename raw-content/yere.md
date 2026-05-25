---
title: "Yere"
description: "A full-stack LMS connecting high-performing students with universities and recruiters. AI-generated quizzes from textbooks, an admin dashboard surfacing top performers, and a recruitment data marketplace built with React, Node.js, and OpenAI APIs."
slug: "yere"
order: 4
url: "https://www.axtrastudios.com/"
mainImage: "/main_hero.png"
images:
  - "/main_hero.png"
tools:
  - "React"
  - "Vite"
  - "Node.js"
  - "Express.js"
  - "React Query"
  - "shadcn/ui"
  - "OpenAI API"
---

# Project Documentation: Yere

## Overview
- **Project Name:** Yere
- **Company:** Axtra Studios
- **Company URL:** `https://www.axtrastudios.com/`
- **Role:** Technical Lead Engineer
- **Timeline:** December 2024 – February 2025
- **Tech Stack:** React, Vite, Node.js, Express.js, React Query, shadcn/ui, OpenAI API

---

## Core Project Objectives
Yere is a highly scalable, full-stack Learning Management System (LMS) and talent marketplace designed specifically for the French educational ecosystem (covering grades 9 to 12, including specialized levels such as *Seconde*, *Première*, and *Terminale*). The platform bridges the gap between secondary education and higher academic/corporate recruiting by tracking student performance, generating intelligent curricula, and surfacing high-potential talent to institutions.

---

## Technical Architecture & Core Subsystems

### 1. AI-Powered Curriculum & Assessment Engine
* **Automated Quiz Generation:** Integrated the OpenAI API to analyze and parse uploaded textbook PDFs or text prompts to dynamically generate multi-page, context-aware Multiple Choice Question (MCQ) assessments.
* **Granular Academic Mapping:** Structured content around the French secondary school system, mapping courses and quiz datasets across 6 key educational levels from 9th grade up through *Première* and *Terminale*.

### 2. Recruitment Data Marketplace & Admin Analytics
* **Institutional Dashboards:** Built comprehensive analytics panels for educational institutions and recruiters to monitor macro-level student performance trends.
* **Talent Discovery Pipeline:** Developed sorting and filtering algorithms that securely surface anonymized, high-performing student data to help universities isolate and recruit top-tier talent.

### 3. Role-Based Access Control (RBAC) & Subscription Management
* **Granular User Roles:** Implemented strict access barriers separating standard Student Users, Corporate/University Recruiters, and Platform Administrators.
* **Subscription State Management:** Designed a robust subscription workflow allowing users to seamlessly transition between active subscription tiers and unsubscribed states, programmatically toggling premium assessment features and data access flags.

### 4. Scalable Full-Stack Infrastructure
* **Frontend State Architecture:** Leveraged React Query alongside Vite to establish high-performance asynchronous data fetching, minimizing UI layout shifts and caching student assessment entries locally.
* **Backend Performance:** Structured an Express.js and Node.js micro-architecture capable of handling heavy payload transfers resulting from dense PDF parsing and simultaneous quiz completion queries.

---

## Engineering Leadership & Impact

* **Technical Lead Leadership:** Steered architectural decisions across the 3-month development lifecycle, ensuring rigorous TypeScript/JavaScript type consistency and clean routing architecture.
* **Production Scale:** Directed the system design to ensure horizontal scalability, allowing the platform to manage large volumes of concurrently executing AI quiz requests and heavy data-marketplace queries smoothly.