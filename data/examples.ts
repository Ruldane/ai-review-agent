export interface CodeExample {
  id: string;
  title: string;
  code: string;
  language: string;
  context: string;
}

export const examples: CodeExample[] = [
  {
    id: "python-bugs",
    title: "Python: User Processing (Bugs)",
    language: "python",
    context: "Backend utility for processing user data from API responses",
    code: `def process_users(data):
    users = data["users"]
    results = []
    for i in range(len(users)):
        user = users[i]
        name = user["name"].strip()
        age = int(user["age"])
        email = user.get("email")
        if age > 0 and age < 150:
            score = calculate_score(user)
            results.append({
                "name": name,
                "age": age,
                "email": email.lower(),
                "score": score / len(results),
                "rank": i
            })
    return results

def calculate_score(user):
    base = 100
    if user["premium"]:
        base = base * 1.5
    if user["age"] > 60:
        base += 20
    return base`,
  },
  {
    id: "react-performance",
    title: "React: Dashboard Component (Performance)",
    language: "typescript",
    context: "React dashboard component that renders a list of items with filtering",
    code: `import React, { useState, useEffect } from 'react';

interface Item {
  id: number;
  name: string;
  category: string;
  price: number;
}

export function Dashboard({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState('');
  const [sortedItems, setSortedItems] = useState<Item[]>([]);

  useEffect(() => {
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
    const sorted = filtered.sort((a, b) => a.price - b.price);
    setSortedItems(sorted);
  }, [items, filter]);

  const total = sortedItems.reduce((sum, item) => sum + item.price, 0);
  const categories = [...new Set(items.map(i => i.category))];

  return (
    <div>
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Search..."
      />
      <p>Total: \${total.toFixed(2)}</p>
      <p>Categories: {categories.join(', ')}</p>
      {sortedItems.map(item => (
        <div key={item.id} style={{ padding: '10px', border: '1px solid #ccc' }}>
          <h3>{item.name}</h3>
          <p>\${item.price}</p>
          <button onClick={() => console.log(JSON.stringify(item))}>
            Details
          </button>
        </div>
      ))}
    </div>
  );
}`,
  },
  {
    id: "go-security",
    title: "Go: HTTP Handler (Security)",
    language: "go",
    context: "HTTP API handler for user authentication and data retrieval",
    code: `package main

import (
    "database/sql"
    "fmt"
    "net/http"
    "os"
)

var db *sql.DB

func loginHandler(w http.ResponseWriter, r *http.Request) {
    username := r.FormValue("username")
    password := r.FormValue("password")

    query := fmt.Sprintf("SELECT id, role FROM users WHERE username='%s' AND password='%s'", username, password)
    row := db.QueryRow(query)

    var id int
    var role string
    err := row.Scan(&id, &role)
    if err != nil {
        http.Error(w, "Invalid credentials", 401)
        return
    }

    token := fmt.Sprintf("%d-%s-%s", id, role, os.Getenv("SECRET_KEY"))
    http.SetCookie(w, &http.Cookie{
        Name:  "session",
        Value: token,
    })

    w.Header().Set("Access-Control-Allow-Origin", "*")
    fmt.Fprintf(w, "Welcome %s!", username)
}

func getUserData(w http.ResponseWriter, r *http.Request) {
    userId := r.URL.Query().Get("id")
    query := fmt.Sprintf("SELECT * FROM user_data WHERE user_id=%s", userId)
    rows, _ := db.Query(query)
    defer rows.Close()

    for rows.Next() {
        var data string
        rows.Scan(&data)
        fmt.Fprintf(w, data)
    }
}`,
  },
  {
    id: "ts-style",
    title: "TypeScript: Utility Functions (Style)",
    language: "typescript",
    context: "Utility functions for data transformation in a web application",
    code: `export function proc(d: any[], t: number) {
  let r: any[] = [];
  for (let i = 0; i < d.length; i++) {
    let x = d[i];
    if (x.v > t) {
      let n = {
        nm: x.n,
        val: x.v * 1.08,
        dt: new Date().toISOString(),
        cat: x.v > 1000 ? "high" : x.v > 500 ? "med" : "low",
        id: Math.random().toString(36).substring(7),
      };
      r.push(n);
    }
  }
  return r;
}

export function fmt(v: number): string {
  if (v >= 1000000) return (v / 1000000).toFixed(1) + "M";
  if (v >= 1000) return (v / 1000).toFixed(1) + "K";
  return v.toString();
}

export function chk(e: string): boolean {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(e);
}

export function ddf(d1: any, d2: any) {
  let ms = new Date(d1).getTime() - new Date(d2).getTime();
  return Math.floor(ms / 86400000);
}`,
  },
];
