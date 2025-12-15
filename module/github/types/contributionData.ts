export interface ContributionCalendar {
  totalContributions: number;
  weeks: {
    contributionDays: {
      contributionCount: number;
      date: string;
      color: string;
    }[];
  }[];
}

export interface ContributionData {
  user: {
    contributionsCollection: {
      contributionCalendar: ContributionCalendar | ContributionCalendar[];
    };
  };
}
