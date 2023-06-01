import React from 'react';
import { render } from '@testing-library/react';
import { useRouter } from 'next/router';
import TopicDetails from '../index';

// Mock the useRouter hook
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('TopicDetails', () => {
  beforeEach(() => {
    // Clear all mock implementations and instances between tests
    jest.clearAllMocks();
  });

  it('renders the component without errors', () => {
    // Mock the useRouter hook return value
    useRouter.mockReturnValue({});

    render(<TopicDetails />);
    // Assert that the component renders without throwing any errors
    // You can add more specific assertions as per your requirements
  });

  it('renders the TimelineInfoBar component', () => {
    useRouter.mockReturnValue({});

    const { getByTestId } = render(<TopicDetails />);
    const timelineInfoBar = getByTestId('timeline-info-bar');

    // Assert that the TimelineInfoBar component is rendered
    expect(timelineInfoBar).toBeInTheDocument();
    // You can add more specific assertions to test the content and behavior of TimelineInfoBar component
  });

  it('renders the SideBarTimeline component with correct props', () => {
    useRouter.mockReturnValue({});
    const timelineDescript = [];

    const { getByTestId } = render(<TopicDetails />);
    const sideBarTimeline = getByTestId('side-bar-timeline');

    // Assert that the SideBarTimeline component is rendered
    expect(sideBarTimeline).toBeInTheDocument();
    // You can add more specific assertions to test the props and behavior of SideBarTimeline component
  });

  it('renders the Collapse component with correct defaultActiveKey and className', () => {
    useRouter.mockReturnValue({});

    const { getByTestId } = render(<TopicDetails />);
    const collapse = getByTestId('collapse');

    // Assert that the Collapse component is rendered
    expect(collapse).toBeInTheDocument();
    // You can add more specific assertions to test the defaultActiveKey and className of Collapse component
  });

  it('renders the TimeLine component with correct props', () => {
    useRouter.mockReturnValue({});
    const timelineDescript = [];

    const { getByTestId } = render(<TopicDetails />);
    const timeline = getByTestId('timeline');

    // Assert that the TimeLine component is rendered
    expect(timeline).toBeInTheDocument();
    // You can add more specific assertions to test the props and behavior of TimeLine component
  });

  // Add more test cases as needed for the specific behavior and functionality of your component

});
