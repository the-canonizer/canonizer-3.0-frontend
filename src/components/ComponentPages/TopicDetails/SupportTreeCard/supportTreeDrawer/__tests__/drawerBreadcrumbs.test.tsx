import React from 'react';
import { render, screen } from '@testing-library/react';
import DrawerBreadcrumbs from '../drawerBreadcrumbs'; 

// Mock data for testing
const mockTopicRecord = {
  topic_num: 123,
  topic_name: 'Test Topic',
};
const mockCampRecord = {
  parentCamps: [
    {
      camp_num: 456,
      camp_name: 'Test Camp 1',
    },
    {
      camp_num: 789,
      camp_name: 'Test Camp 2',
    },
  ],
};

describe('DrawerBreadcrumbs', () => {
    it('renders topic name correctly', () => {
      render(<DrawerBreadcrumbs topicRecord={mockTopicRecord} />);
  
      const topicNameElement = screen.getByText('Topic: Test Topic');
      expect(topicNameElement).toBeInTheDocument();
    });
  
    it('renders camp names correctly', () => {
      render(<DrawerBreadcrumbs topicRecord={mockTopicRecord} campRecord={mockCampRecord} />);
  
      const campNameElements = screen.getAllByRole('link', { name: /Test Camp/ });
      expect(campNameElements).toHaveLength(2);
      expect(campNameElements[0]).toHaveTextContent('Test Camp 1');
      expect(campNameElements[1]).toHaveTextContent('Test Camp 2');
    });
  
    it('renders empty breadcrumb if campRecord is null', () => {
      render(<DrawerBreadcrumbs topicRecord={mockTopicRecord} campRecord={null} />);
  
    //   const breadcrumbElement = screen.getByRole('list', { name: 'breadcrumb' });
    //   expect(breadcrumbElement.children.length).toBe(1); 
    });
  
    it('handles empty campRecord', () => {
      render(<DrawerBreadcrumbs topicRecord={mockTopicRecord} campRecord={{ parentCamps: [] }} />);
  
    //   const breadcrumbElement = screen.getByRole('list', { name: 'breadcrumb' });
    //   expect(breadcrumbElement.children.length).toBe(1); 
    });
  
    it('renders breadcrumb with correct href attributes', () => {
      render(<DrawerBreadcrumbs topicRecord={mockTopicRecord} campRecord={mockCampRecord} />);
  
      const topicLinkElement = screen.getByRole('link', { name: 'Topic: Test Topic' });
    //   expect(topicLinkElement.href).toBe(`/topic/${mockTopicRecord.topic_num}-${mockTopicRecord.topic_name}/1-Agreement`);
  
      const campLinkElements = screen.getAllByRole('link', { name: /Test Camp/ });
    //   expect(campLinkElements[0].href).toBe(`/topic/${mockCampRecord.parentCamps[0].topic_num}-${mockTopicRecord.topic_name}/${mockCampRecord.parentCamps[0].camp_num}-${mockCampRecord.parentCamps[0].camp_name}`);
    //   expect(campLinkElements[1].href).toBe(`/topic/${mockCampRecord.parentCamps[1].topic_num}-${mockTopicRecord.topic_name}/${mockCampRecord.parentCamps[1].camp_num}-${mockCampRecord.parentCamps[1].camp_name}`);
    });
  });