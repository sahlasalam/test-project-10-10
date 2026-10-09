"use client";

import { useEffect, useState } from "react";
import axios from "../../utils/axios";

export default function Login() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalUsers: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const limit = 10;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch users when page or debounced search changes
  useEffect(() => {
    const controller = new AbortController();

    async function fetchUsers() {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get("users", {
          params: {
            // action: 'pastor-roles',
            page,
            search: debouncedSearch,
            limit,
          },
          signal: controller.signal,
        });

        if (response.data?.status === 1) {
          setUsers(response.data.data ?? []);

          // Adjust these fields to match your API response
          setPagination({
            totalUsers: response.data.totalUsers ?? 0,
            totalPages: response.data.totalPages ?? 0,
          });
        } else {
          setUsers([]);
        }
      } catch (err) {
        if (controller.signal.aborted) return;

        console.error("Error fetching users:", err);
        setError("Failed to fetch users.");
        setUsers([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchUsers();

    return () => controller.abort();
  }, [page, debouncedSearch]);

  // Reset pagination when the search changes
  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div>
      <h2>Users</h2>

      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
      />

      {loading && <p>Loading users...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <ul>
          {users.map((user) => (
            <li key={user._id}>{user.name}</li>
          ))}
        </ul>
      )}

      <div>
        <button
          disabled={page <= 1 || loading}
          onClick={() => setPage((current) => current - 1)}
        >
          Previous
        </button>

        <span>
          {" "}
          Page {page} of {pagination.totalPages}{" "}
        </span>

        <button
          disabled={
            page >= pagination.totalPages ||
            loading ||
            pagination.totalPages === 0
          }
          onClick={() => setPage((current) => current + 1)}
        >
          Next
        </button>
      </div>

      <p>Total users: {pagination.totalUsers}</p>
    </div>
  );
}
