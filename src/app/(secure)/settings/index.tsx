"use client";

import React from "react";
import { connect } from "react-redux";
import { RootState } from "../../store/reducer";
import { User } from "../state/types";

interface SettingsPageProps {
  user: User | null;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user }) => {
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading user settings...</div>
      </div>
    );
  }

  const ToggleRow = ({
    title,
    description,
    value,
    unit,
  }: {
    title: string;
    description: string;
    value: number;
    unit: string;
  }) => (
    <div className="flex items-center justify-between py-6 px-6 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900 dark:text-gray-100">
          {title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {description}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-mono text-gray-700 dark:text-gray-300 min-w-[80px] text-right">
          {value} {unit}
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            defaultChecked={value > 0}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  );

  return (
    <div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <ToggleRow
          title="Daily Steps Tracking"
          description="Display current step count on dashboard"
          value={user.settings.dashboardStepsToday}
          unit="steps"
        />
        <ToggleRow
          title="Water Intake Today"
          description="Show today's water consumption progress"
          value={user.settings.dashboardWaterToday}
          unit="oz"
        />
        <ToggleRow
          title="Water Quick Add"
          description="Quick add increment for water tracking"
          value={user.settings.dashboardWaterAdd}
          unit="oz"
        />
        <ToggleRow
          title="Daily Calories"
          description="Display calorie intake for today"
          value={user.settings.dashboardCaloriesToday}
          unit="cal"
        />
        <ToggleRow
          title="Calorie Quick Add"
          description="Quick add increment for calorie tracking"
          value={user.settings.dashboardCaloriesAdd}
          unit="cal"
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  user: state.app.user,
});

export default connect(mapStateToProps)(SettingsPage);
