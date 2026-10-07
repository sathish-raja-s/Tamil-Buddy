import { describe, it, expect, beforeEach } from 'vitest';
import { validationService } from '../../src/services/validationService';

describe('User Validation Service Unit Tests', () => {
  beforeEach(() => {
    validationService.clearEvaluations();
    validationService.setDemoEnabled(false);
  });

  it('generates sequential anonymous participant IDs', () => {
    const id1 = validationService.getNextParticipantId();
    expect(id1).toBe('Participant P01');
  });

  it('correctly calculates usability, engagement, and satisfaction scores from Likert answers', () => {
    const evaluation = validationService.addEvaluation(
      'Participant P01',
      'Learner',
      ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10'],
      300,
      {
        q1_easyToUse: 5,
        q2_engagingActivities: 4,
        q3_letterTracing: 5,
        q4_gamesEnjoyable: 4,
        q5_storiesRhymesUseful: 5,
        q6_aiBuddyHelpful: 4,
        q7_audioClear: 5,
        q8_websiteResponsive: 5,
        q9_learningProgression: 5,
        q10_recommendPlatform: 5,
        likedMost: 'Tracing was fun',
        shouldImprove: 'More games',
        facedTechnicalIssue: false,
        technicalIssueDetails: '',
      }
    );

    expect(evaluation.scores.usability).toBe(5.0); // (5 + 5 + 5) / 3
    expect(evaluation.scores.engagement).toBe(4.3); // (4 + 4 + 5) / 3 = 4.33
    expect(evaluation.scores.aiHelpfulness).toBe(4.0);
    expect(evaluation.scores.audioQuality).toBe(5.0);
    expect(evaluation.scores.overallSatisfaction).toBe(4.7);
  });

  it('supports toggling benchmark demo evaluations for comparative review', () => {
    expect(validationService.getEvaluations().length).toBe(0);

    validationService.setDemoEnabled(true);
    const demoList = validationService.getEvaluations();
    expect(demoList.length).toBe(3);
    expect(demoList[0].participantId).toBe('Participant P01');
    expect(demoList[1].participantId).toBe('Participant P02');
    expect(demoList[2].participantId).toBe('Participant P03');

    const aggregates = validationService.getAggregates();
    expect(aggregates).not.toBeNull();
    expect(aggregates?.participantCount).toBe(3);
    expect(aggregates?.taskSuccessRate).toBe(100);
  });
});
