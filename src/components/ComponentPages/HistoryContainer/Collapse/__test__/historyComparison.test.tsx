import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HistoryComparison from '../historyComparison'
import moment from 'moment';

// Mock the useRouter function
jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    query: {
      from: 'camp',
      routes: ['topic-name'],
    },
  })),
}));

// Mock the capitalizeFirstLetter function
jest.mock('src/utils/generalUtility', () => ({
  capitalizeFirstLetter: jest.fn((str) => str.charAt(0).toUpperCase() + str.slice(1)),
}));

const covertToTime = (unixTime) =>
  moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");

describe('HistoryComparison', () => {
  const mockCampStatement = {
    value: 'Camp Name',
    note: 'Edit Summary',
    namespace: 'namespace',
    key_words: 'keywords',
    camp_about_url: 'https://example.com',
    camp_about_nick_name: 'Nickname',
    submitter_nick_name: 'Submitter',
    is_disabled: false,
    is_one_level: 0,
    is_archive: 0,
    submit_time: 1693251200,
    go_live_time: 1693337600,
    parsed_value: '<p>Statement content</p>',
    camp_leader_nick_name:"Nick Name"
  };

  test('renders correctly for "camp" history', () => {
    render(<HistoryComparison campStatement={mockCampStatement} historyOf="camp"/>);

    // Check if expected elements are rendered
    expect(screen.getByText('Updates')).toBeInTheDocument();
    expect(screen.getByText('Camp Name')).toBeInTheDocument();
    expect(screen.getByText('Edit Summary')).toBeInTheDocument();
    expect(screen.getByText('https://example.com')).toBeInTheDocument();
    expect(screen.getByText('Nickname')).toBeInTheDocument();
    expect(screen.getByText('Submitter')).toBeInTheDocument();
    expect(screen.getByText(covertToTime(mockCampStatement?.submit_time))).toBeInTheDocument();
    expect(screen.getByText(covertToTime(mockCampStatement?.go_live_time))).toBeInTheDocument();
    expect(screen.getByText(mockCampStatement?.camp_leader_nick_name)).toBeInTheDocument();
    expect(screen.getByText(mockCampStatement?.camp_about_url)).toBeInTheDocument();
    expect(screen.getByText(mockCampStatement?.camp_about_nick_name)).toBeInTheDocument();
    expect(screen.getByText(mockCampStatement?.key_words)).toBeInTheDocument();
    // expect(screen.getByText(mockCampStatement?.is_archive)).toBeInTheDocument();
    // expect(screen.getByText(mockCampStatement?.is_one_level)).toBeInTheDocument();
    // expect(screen.getByText(mockCampStatement?.is_disabled)).toBeInTheDocument();
  });

  test('renders correctly for "topic" history', () => {
    render(<HistoryComparison campStatement={mockCampStatement} historyOf="topic" />);

    // Check if expected elements are rendered
    expect(screen.getByText('Updates')).toBeInTheDocument();
    expect(screen.getByText('Edit Summary')).toBeInTheDocument();
    expect(screen.getByText('Submitter')).toBeInTheDocument();
    expect(screen.getByText(covertToTime(mockCampStatement?.submit_time))).toBeInTheDocument();
    expect(screen.getByText(covertToTime(mockCampStatement?.go_live_time))).toBeInTheDocument();
    expect(screen.getByText(mockCampStatement?.value)).toBeInTheDocument();
    // expect(screen.getByText(mockCampStatement?.namespace)).toBeInTheDocument();
  });

  test('renders correctly for "statement" history', () => {
    render(<HistoryComparison campStatement={mockCampStatement} historyOf="statement" s1={true} />);

    // Check if expected elements are rendered
    expect(screen.getByText('Edit Summary')).toBeInTheDocument();
    expect(screen.getByText('Submitter')).toBeInTheDocument();
    expect(screen.getByText(covertToTime(mockCampStatement?.submit_time))).toBeInTheDocument();
    expect(screen.getByText(covertToTime(mockCampStatement?.go_live_time))).toBeInTheDocument();
    // expect(screen.getByText(mockCampStatement?.parsed_value)).toBeInTheDocument();
  });

  // Add more test cases for different scenarios and edge cases
  // ...
});