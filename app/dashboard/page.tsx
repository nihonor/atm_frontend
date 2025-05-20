"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    if (!token) {
      router.push("/");
      return;
    }

    // Redirect admin to admin dashboard
    if (userRole === "ADMIN") {
      router.push("/admin/dashboard");
      return;
    }

    // Fetch user data
    fetch("http://localhost:8080/api/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Not authorized");
        }
        return response.json();
      })
      .then((data) => {
        setUserData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        router.push("/");
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-700">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                Welcome, {userData?.username}
              </h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("userRole");
                  router.push("/");
                }}
                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900">
                Account Balance
              </h3>
              <p className="mt-1 text-3xl font-semibold text-gray-900">
                {userData?.balance || 0} RWF
              </p>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900">
                Recent Transactions
              </h3>
              <div className="mt-4 space-y-2">
                {userData?.recentTransactions?.map(
                  (transaction: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{transaction.description}</span>
                      <span
                        className={
                          transaction.type === "credit"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {transaction.type === "credit" ? "+" : "-"}
                        {transaction.amount} RWF
                      </span>
                    </div>
                  )
                ) || <p>No recent transactions</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
