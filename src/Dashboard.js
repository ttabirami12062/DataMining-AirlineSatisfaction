// Dashboard.js
import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(ChartDataLabels);

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  // -----------------------------
  // Load dashboard data from Flask
  // -----------------------------
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/dashboard-summary");
        if (!res.ok) {
          throw new Error("Network error");
        }
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error(err);
        setError(
          "Unable to load dashboard data. Please make sure the Flask backend is running."
        );
      }
    }
    load();
  }, []);

  // -----------------------------
  // Error / loading states
  // -----------------------------
  if (error) {
    return (
      <div className="section-wide">
        <div className="dashboard-card">
          <p className="error-text">{error}</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="section-wide">
        <div className="dashboard-card">
          <p>Loading dashboard…</p>
        </div>
      </div>
    );
  }

  // -----------------------------
  // Basic numbers & distributions
  // -----------------------------
  const totalPassengers = summary.total_passengers ?? 0;
  const distributions = summary.distributions || {};

  const satDist = distributions.satisfaction || {};
  const pctSatisfied = satDist["Satisfied"] ?? 0;
  const pctNotSatisfied = satDist["Not satisfied"] ?? 0;

  const custDist = distributions.customer_type || {};
  const pctLoyal = custDist["Loyal Customer"] ?? 0;

  // -----------------------------
  // Helpers for charts
  // -----------------------------
const animationSettings = {
  animateScale: true,    // Zoom in effect (scale animation)
  animateRotate: true,   // Rotation animation for Pie charts
  duration: 9000,        // Animation duration in ms
  easing: "easeOutElastic", // Elastic easing for bounce/pop effect
};

  // Stacked bar (Not satisfied vs Satisfied) for a given category
  const buildCrossData = (categoryKey) => {
    const cat = summary.by_category?.[categoryKey] || {};
    const labels = Object.keys(cat);
    const notSat = labels.map((label) => cat[label]["Not satisfied"] || 0);
    const sat = labels.map((label) => cat[label]["Satisfied"] || 0);

    return {
      labels,
      datasets: [
        {
          label: "Not satisfied",
          data: notSat,
          backgroundColor: "rgba(78, 121, 167, 0.9)", // blue
        },
        {
          label: "Satisfied",
          data: sat,
          backgroundColor: "rgba(89, 161, 79, 0.9)", // green
        },
      ],
    };
  };

const crossOptions = {
  animation:animationSettings,
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      title: { display: true, text: "Count" },
    },
  },
  plugins: {
    legend: { position: "top" },

    // ⬇️ add this block ⬇️
    datalabels: {
      anchor: "end",
      align: "top",
      color: "rgba(0,0,0,1)",    // solid black
      font: {
        weight: "bold",
        size: 11,
      },
      formatter: (value) => value.toLocaleString("en-IN"),
    },
  },
};


  // Generic pie builder from a distribution object
  const PIE_COLORS = ["#3498db", "#2ecc71", "#9c755f", "#f28e2b"];

  const buildPieData = (distObj) => {
    const labels = Object.keys(distObj);
    const values = Object.values(distObj);

    const colors = labels.map(
      (_, idx) => PIE_COLORS[idx % PIE_COLORS.length]
    );

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderWidth: 1,
        },
      ],
    };
  };

const pieOptions = {
  animation:animationSettings,
  plugins: {
    legend: { position: "bottom" },


    datalabels: {
      formatter: (value, ctx) => {
        const dataArr = ctx.chart.data.datasets[0].data;
        const total = dataArr.reduce((a, b) => a + b, 0);
        const pct = ((value / total) * 100).toFixed(1);
        return pct + "%";
      },
      color: "#000000",
      font: {
        weight: "bold",
        size: 12,
      }
    }
  }
};


  // Specific pie datasets
  const satisfactionPieData = buildPieData(satDist);
  const genderPieData = buildPieData(distributions.gender || {});
  const custPieData = buildPieData(distributions.customer_type || {});
  const travelPieData = buildPieData(distributions.travel || {});
  const classPieData = buildPieData(distributions.class || {});

  // -----------------------------
  // JSX
  // -----------------------------
  return (
    <div className="section-wide">
      <div className="dashboard-card">
        <h1
          className="h1-lg"
          style={{ textAlign: "center", marginBottom: "1.5rem" }}
        >
          Airline Passenger Satisfaction – Dashboard
        </h1>

        {/* Top-level metrics */}
        <div className="dashboard-metrics">
          <div className="metric-card">
            <p className="metric-label">Total Passengers</p>
            <p className="metric-value">
              {totalPassengers.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="metric-card">
            <p className="metric-label">% Satisfied</p>
            <p className="metric-value">{pctSatisfied.toFixed(1)}%</p>
          </div>
          <div className="metric-card">
            <p className="metric-label">% Loyal Customers</p>
            <p className="metric-value">{pctLoyal.toFixed(1)}%</p>
          </div>
        </div>

        {/* Overall satisfaction pie */}
        <div className="dashboard-row">
          <div className="chart-box">
            <h3 className="chart-title">Satisfaction Distribution</h3>
            <div className="chart-inner">
              <Pie data={satisfactionPieData} options={pieOptions} />
            </div>
          </div>

          <p className="chart-note">
            The satisfaction variable is fairly balanced, with a slightly higher
            share of passengers marked as{" "}
            <strong>Not satisfied</strong> compared to{" "}
            <strong>Satisfied</strong>.
          </p>
        </div>

        {/* Passenger profile – distributions (pie charts) */}
        <h2 className="h2-md" style={{ marginTop: "2rem" }}>
          Passenger Profile – Distributions
        </h2>

        <div className="profile-grid">
          <div className="chart-box">
            <h3 className="chart-title">Gender Distribution</h3>
            <div className="chart-inner">
              <Pie data={genderPieData} options={pieOptions} />
            </div>
          </div>

          <div className="chart-box">
            <h3 className="chart-title">Customer Type Distribution</h3>
            <div className="chart-inner">
              <Pie data={custPieData} options={pieOptions} />
            </div>
          </div>

          <div className="chart-box">
            <h3 className="chart-title">Type of Travel Distribution</h3>
            <div className="chart-inner">
              <Pie data={travelPieData} options={pieOptions} />
            </div>
          </div>

          <div className="chart-box">
            <h3 className="chart-title">Class Distribution</h3>
            <div className="chart-inner">
              <Pie data={classPieData} options={pieOptions} />
            </div>
          </div>
        </div>

        {/* Passenger profile – cross-tabs (bar charts) */}
        <h2 className="h2-md" style={{ marginTop: "2rem" }}>
          Passenger Profile – Satisfaction Breakdown
        </h2>

        <div className="profile-grid">
          <div className="chart-box">
            <h3 className="chart-title">Gender vs Satisfaction</h3>
            <div className="chart-inner">
              <Bar data={buildCrossData("gender")} options={crossOptions} />
            </div>
            <p className="chart-caption">
              Gender is almost evenly split between male and female passengers.
            </p>
          </div>

          <div className="chart-box">
            <h3 className="chart-title">Customer Type vs Satisfaction</h3>
            <div className="chart-inner">
              <Bar
                data={buildCrossData("customer_type")}
                options={crossOptions}
              />
            </div>
            <p className="chart-caption">
              Most passengers in the dataset are labelled as loyal customers.
            </p>
          </div>

          <div className="chart-box">
            <h3 className="chart-title">Type of Travel vs Satisfaction</h3>
            <div className="chart-inner">
              <Bar data={buildCrossData("travel")} options={crossOptions} />
            </div>
            <p className="chart-caption">
              Business travel makes up the majority of trips in this dataset.
            </p>
          </div>

          <div className="chart-box">
            <h3 className="chart-title">Class vs Satisfaction</h3>
            <div className="chart-inner">
              <Bar data={buildCrossData("class")} options={crossOptions} />
            </div>
            <p className="chart-caption">
              Most passengers fly in Business or Eco class, with a smaller share
              in Eco Plus.
            </p>
          </div>
        </div>

        <p className="chart-footnote">
          This dashboard provides a quick overview of the cleaned training
          dataset used for the airline passenger satisfaction project.
        </p>
      </div>
    </div>
  );
}
