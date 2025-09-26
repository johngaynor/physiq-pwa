import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import StatisticsCard from "./StatisticsCard";

// Mock the convertTime function
jest.mock("@/app/components/Time", () => ({
  convertTime: jest.fn((time: number) => {
    const sign = time < 0 ? "-" : "";
    const absTime = Math.abs(time);
    const hours = Math.floor(absTime);
    const minutes = Math.floor((absTime - hours) * 60);
    return `${sign}${hours > 0 ? hours + "h " : ""}${minutes}m`;
  }),
}));

// Mock the UI components
jest.mock("@/components/ui/card", () => ({
  Card: ({ children, className, onClick, ...props }: any) => {
    const isTooltipCard = props["data-testid"] || className?.includes("p-2");
    return (
      <div
        className={className}
        onClick={onClick}
        data-testid={isTooltipCard ? "tooltip-card" : "main-card"}
      >
        {children}
      </div>
    );
  },
  CardContent: ({ children }: any) => (
    <div data-testid="card-content">{children}</div>
  ),
}));

jest.mock("@/components/ui/tooltip", () => ({
  Tooltip: ({ children }: any) => <div data-testid="tooltip">{children}</div>,
  TooltipTrigger: ({ children }: any) => (
    <div data-testid="tooltip-trigger">{children}</div>
  ),
  TooltipContent: ({ children }: any) => (
    <div data-testid="tooltip-content">{children}</div>
  ),
}));

jest.mock("@/lib/utils", () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(" "),
}));

// Mock Lucide React icons
jest.mock("lucide-react", () => ({
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  TrendingDown: () => <div data-testid="trending-down-icon" />,
  MoveHorizontal: () => <div data-testid="move-horizontal-icon" />,
}));

describe("StatisticsCard", () => {
  const defaultProps = {
    title: "Test Metric",
    type: "weight" as const,
    value: 180.5,
    stat: 2.3,
    description: "Test description",
  };

  describe("Weight Type", () => {
    it("formats weight values correctly", () => {
      render(
        <StatisticsCard
          {...defaultProps}
          type="weight"
          value={180.5}
          stat={2.3}
        />
      );

      expect(screen.getByText("180.5 lbs")).toBeInTheDocument();
      expect(screen.getByText("2.3 lbs")).toBeInTheDocument();
    });

    it("handles zero weight values", () => {
      render(
        <StatisticsCard {...defaultProps} type="weight" value={0} stat={0} />
      );

      expect(screen.getByText("--")).toBeInTheDocument();
      expect(screen.getByText("0.0 lbs")).toBeInTheDocument();
    });

    it("handles negative weight stats correctly", () => {
      render(
        <StatisticsCard
          {...defaultProps}
          type="weight"
          value={180.5}
          stat={-2.3}
        />
      );

      expect(screen.getByText("180.5 lbs")).toBeInTheDocument();
      expect(screen.getByText("2.3 lbs")).toBeInTheDocument(); // Should show absolute value
      expect(screen.getByTestId("trending-down-icon")).toBeInTheDocument();
    });
  });

  describe("Body Fat Type", () => {
    it("formats body fat values correctly", () => {
      render(
        <StatisticsCard
          {...defaultProps}
          type="bodyfat"
          value={15.8}
          stat={1.2}
        />
      );

      expect(screen.getByText("15.8%")).toBeInTheDocument();
      expect(screen.getByText("1.2%")).toBeInTheDocument();
    });

    it("handles zero body fat values", () => {
      render(
        <StatisticsCard {...defaultProps} type="bodyfat" value={0} stat={0} />
      );

      expect(screen.getByText("--")).toBeInTheDocument();
      expect(screen.getByText("0.0%")).toBeInTheDocument();
    });
  });

  describe("Steps Type", () => {
    it("formats steps values correctly", () => {
      render(
        <StatisticsCard
          {...defaultProps}
          type="steps"
          value={8234}
          stat={1500}
        />
      );

      expect(screen.getByText("8234")).toBeInTheDocument();
      expect(screen.getByText("1500")).toBeInTheDocument();
    });

    it("handles zero steps values", () => {
      render(
        <StatisticsCard {...defaultProps} type="steps" value={0} stat={0} />
      );

      expect(screen.getByText("--")).toBeInTheDocument();
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("formats decimal steps as integers", () => {
      render(
        <StatisticsCard
          {...defaultProps}
          type="steps"
          value={8234.7}
          stat={1500.9}
        />
      );

      expect(screen.getByText("8235")).toBeInTheDocument(); // Should round
      expect(screen.getByText("1501")).toBeInTheDocument(); // Should round
    });
  });

  describe("Sleep Type", () => {
    it("formats sleep values correctly using convertTime", () => {
      render(
        <StatisticsCard {...defaultProps} type="sleep" value={7.5} stat={0.5} />
      );

      expect(screen.getByText("7h 30m")).toBeInTheDocument();
      expect(screen.getByText("30m")).toBeInTheDocument();
    });

    it("handles zero sleep values", () => {
      render(
        <StatisticsCard {...defaultProps} type="sleep" value={0} stat={0} />
      );

      expect(screen.getByText("--")).toBeInTheDocument();
      expect(screen.getByText("0h 0m")).toBeInTheDocument();
    });

    it("handles negative sleep stats", () => {
      render(
        <StatisticsCard
          {...defaultProps}
          type="sleep"
          value={7.5}
          stat={-0.5}
        />
      );

      expect(screen.getByText("7h 30m")).toBeInTheDocument();
      expect(screen.getByText("30m")).toBeInTheDocument(); // Should show absolute value
      expect(screen.getByTestId("trending-down-icon")).toBeInTheDocument();
    });
  });

  describe("Interpretations", () => {
    it("applies positive interpretation styling correctly", () => {
      render(
        <StatisticsCard
          {...defaultProps}
          interpretation="positive"
          stat={2.3}
        />
      );

      const trendElement = screen.getByText("2.3 lbs").closest("div");
      expect(trendElement).toHaveClass("text-green-500", "bg-green-900/30");
      expect(screen.getByTestId("trending-up-icon")).toBeInTheDocument();
    });

    it("applies negative interpretation styling correctly", () => {
      render(
        <StatisticsCard
          {...defaultProps}
          interpretation="negative"
          stat={2.3}
        />
      );

      const trendElement = screen.getByText("2.3 lbs").closest("div");
      expect(trendElement).toHaveClass("text-red-500", "bg-red-900/30");
      expect(screen.getByTestId("trending-up-icon")).toBeInTheDocument();
    });

    it("applies neutral interpretation styling correctly", () => {
      render(
        <StatisticsCard {...defaultProps} interpretation="neutral" stat={2.3} />
      );

      const trendElement = screen.getByText("2.3 lbs").closest("div");
      expect(trendElement).toHaveClass("bg-slate-600/30", "text-slate-500");
    });

    it("defaults to neutral interpretation when not specified", () => {
      render(<StatisticsCard {...defaultProps} stat={2.3} />);

      const trendElement = screen.getByText("2.3 lbs").closest("div");
      expect(trendElement).toHaveClass("bg-slate-600/30", "text-slate-500");
    });
  });

  describe("Trend Icons", () => {
    it("shows trending up icon for positive stats", () => {
      render(<StatisticsCard {...defaultProps} stat={2.3} />);
      expect(screen.getByTestId("trending-up-icon")).toBeInTheDocument();
    });

    it("shows trending down icon for negative stats", () => {
      render(<StatisticsCard {...defaultProps} stat={-2.3} />);
      expect(screen.getByTestId("trending-down-icon")).toBeInTheDocument();
    });

    it("shows horizontal icon for zero stats", () => {
      render(<StatisticsCard {...defaultProps} stat={0} />);
      expect(screen.getByTestId("move-horizontal-icon")).toBeInTheDocument();
    });
  });

  describe("Subtitle Generation", () => {
    it('shows "Trending up" for positive stats with multiple values', () => {
      render(
        <StatisticsCard {...defaultProps} stat={2.3} values={[180, 182, 184]} />
      );
      expect(
        screen.getByText("Trending up on the latest entry")
      ).toBeInTheDocument();
    });

    it('shows "Trending down" for negative stats with multiple values', () => {
      render(
        <StatisticsCard
          {...defaultProps}
          stat={-2.3}
          values={[184, 182, 180]}
        />
      );
      expect(
        screen.getByText("Trending down on the latest entry")
      ).toBeInTheDocument();
    });

    it('shows "No change" for zero stats with multiple values', () => {
      render(
        <StatisticsCard {...defaultProps} stat={0} values={[180, 180, 180]} />
      );
      expect(
        screen.getByText("No change on the latest entry")
      ).toBeInTheDocument();
    });

    it('shows "Insufficient data" for empty values array', () => {
      render(<StatisticsCard {...defaultProps} stat={2.3} values={[]} />);
      expect(screen.getByText("Insufficient data")).toBeInTheDocument();
    });

    it('shows "Only 1 entry" for single value', () => {
      render(<StatisticsCard {...defaultProps} stat={2.3} values={[180]} />);
      expect(screen.getByText("Only 1 entry")).toBeInTheDocument();
    });
  });

  describe("Tooltip Functionality", () => {
    it("renders tooltip with values when values array is provided", () => {
      render(<StatisticsCard {...defaultProps} values={[180, 182, 184]} />);

      expect(screen.getByTestId("tooltip")).toBeInTheDocument();
      expect(
        screen.getByText("Values used in calculation:")
      ).toBeInTheDocument();
    });

    it('shows "No values available" when values array is empty', () => {
      render(<StatisticsCard {...defaultProps} values={[]} />);

      expect(screen.getByText("No values available")).toBeInTheDocument();
    });

    it("formats weight values in tooltip correctly", () => {
      render(
        <StatisticsCard
          {...defaultProps}
          type="weight"
          values={[180.1, 182.5, 184.3]}
        />
      );

      expect(screen.getByText("180.1")).toBeInTheDocument();
      expect(screen.getByText("182.5")).toBeInTheDocument();
      expect(screen.getByText("184.3")).toBeInTheDocument();
    });

    it("formats sleep values in tooltip using convertTime", () => {
      render(
        <StatisticsCard
          {...defaultProps}
          type="sleep"
          values={[7.5, 8.0, 6.5]}
        />
      );

      expect(screen.getByText("7h 30m")).toBeInTheDocument();
      expect(screen.getByText("8h 0m")).toBeInTheDocument();
      expect(screen.getByText("6h 30m")).toBeInTheDocument();
    });

    it('shows "+X more..." when more than 9 values', () => {
      const manyValues = Array.from({ length: 12 }, (_, i) => 180 + i);
      render(<StatisticsCard {...defaultProps} values={manyValues} />);

      expect(screen.getByText("+3 more...")).toBeInTheDocument();
    });

    it("formats steps values in tooltip as integers", () => {
      render(
        <StatisticsCard
          {...defaultProps}
          type="steps"
          values={[8000, 9000, 7500]}
        />
      );

      expect(screen.getByText("8000")).toBeInTheDocument();
      expect(screen.getByText("9000")).toBeInTheDocument();
      expect(screen.getByText("7500")).toBeInTheDocument();
    });
  });

  describe("Click Functionality", () => {
    it("calls onClick when provided and card is clicked", () => {
      const mockOnClick = jest.fn();
      render(<StatisticsCard {...defaultProps} onClick={mockOnClick} />);

      const card = screen.getByTestId("main-card");
      fireEvent.click(card);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("applies cursor-pointer class when onClick is provided", () => {
      const mockOnClick = jest.fn();
      render(<StatisticsCard {...defaultProps} onClick={mockOnClick} />);

      const card = screen.getByTestId("main-card");
      expect(card).toHaveClass("cursor-pointer");
    });

    it("applies cursor-default class when onClick is not provided", () => {
      render(<StatisticsCard {...defaultProps} />);

      const card = screen.getByTestId("main-card");
      expect(card).toHaveClass("cursor-default");
    });
  });

  describe("Content Display", () => {
    it("displays title, value, and description correctly", () => {
      render(
        <StatisticsCard
          {...defaultProps}
          title="Weight"
          description="Your current weight trend"
        />
      );

      expect(screen.getByText("Weight")).toBeInTheDocument();
      expect(screen.getByText("180.5 lbs")).toBeInTheDocument();
      expect(screen.getByText("Your current weight trend")).toBeInTheDocument();
    });

    it("renders the component structure correctly", () => {
      render(<StatisticsCard {...defaultProps} />);

      expect(screen.getByTestId("tooltip")).toBeInTheDocument();
      expect(screen.getByTestId("tooltip-trigger")).toBeInTheDocument();
      expect(screen.getByTestId("tooltip-content")).toBeInTheDocument();
      expect(screen.getByTestId("main-card")).toBeInTheDocument();
      expect(screen.getAllByTestId("card-content")).toHaveLength(2); // Main card and tooltip card
    });
  });

  describe("Edge Cases", () => {
    it("handles undefined/null values gracefully", () => {
      render(
        <StatisticsCard
          title="Test"
          type="weight"
          value={null as any}
          stat={null as any}
          description="Test"
        />
      );

      expect(screen.getByText("--")).toBeInTheDocument();
      expect(screen.getByText("0.0 lbs")).toBeInTheDocument();
    });

    it("handles very large numbers", () => {
      render(
        <StatisticsCard
          {...defaultProps}
          type="steps"
          value={999999}
          stat={50000}
        />
      );

      expect(screen.getByText("999999")).toBeInTheDocument();
      expect(screen.getByText("50000")).toBeInTheDocument();
    });

    it("handles very small decimal numbers", () => {
      render(
        <StatisticsCard
          {...defaultProps}
          type="bodyfat"
          value={0.1}
          stat={0.05}
        />
      );

      const valueElements = screen.getAllByText("0.1%");
      expect(valueElements).toHaveLength(2); // Value and stat both show 0.1%
      // The stat shows 0.1% because Math.abs(0.05).toFixed(1) = "0.1"
    });
  });
});
