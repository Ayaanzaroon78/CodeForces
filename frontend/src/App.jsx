import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import RepositoryForm from './components/RepositoryForm';
import AnalysisProgress from './components/AnalysisProgress';
import RepositorySummary from './components/RepositorySummary';
import RecommendationCard from './components/RecommendationCard';
import WhyRecommended from './components/WhyRecommended';
import SkillMatch from './components/SkillMatch';
import RelevantFiles from './components/RelevantFiles';
import FirstAction from './components/FirstAction';
import ContributionRoadmap from './components/ContributionRoadmap';
import LearningSection from './components/LearningSection';
import RiskSection from './components/RiskSection';
import AIMentor from './components/AIMentor';
import ErrorState from './components/ErrorState';
import Footer from './components/Footer';

import { analyzeRepository, checkHealth } from './services/api';

export default function App() {
  const [repoUrl, setRepoUrl] = useState('');
  const [skills, setSkills] = useState(['Python', 'Git']);
  const [experience, setExperience] = useState('Beginner');
  const [learningGoal, setLearningGoal] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [providerInfo, setProviderInfo] = useState(null);

  useEffect(() => {
    // Check backend health and active AI provider on load
    checkHealth().then((info) => {
      if (info) setProviderInfo(info);
    });
  }, []);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeRepository({
        repoUrl,
        skills,
        experience,
        learningGoal,
      });
      setResult(data);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError({
        code: err.code || 'REQUEST_FAILED',
        message: err.message || 'Failed to complete repository analysis.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  };

  const handleSelectDemo = (url, demoSkills, demoExp) => {
    setRepoUrl(url);
    if (demoSkills) setSkills(demoSkills);
    if (demoExp) setExperience(demoExp);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Header
        hasResults={Boolean(result)}
        onReset={handleReset}
        providerInfo={providerInfo}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Loading State with Real Step Indicator */}
        {isLoading && <AnalysisProgress repoUrl={repoUrl} />}

        {/* Error State */}
        {error && !isLoading && (
          <ErrorState
            error={error}
            onRetry={handleAnalyze}
            onSelectDemo={handleSelectDemo}
          />
        )}

        {/* Idle Landing / Input State */}
        {!result && !isLoading && (
          <div className="space-y-8 animate-fadeIn">
            <HeroSection onSelectDemo={handleSelectDemo} />
            <RepositoryForm
              repoUrl={repoUrl}
              setRepoUrl={setRepoUrl}
              skills={skills}
              setSkills={setSkills}
              experience={experience}
              setExperience={setExperience}
              learningGoal={learningGoal}
              setLearningGoal={setLearningGoal}
              onSubmit={handleAnalyze}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Results Dashboard */}
        {result && !isLoading && (
          <div className="space-y-8 animate-fadeIn">
            {/* Repository Context Bar */}
            <RepositorySummary
              repository={result.repository}
              isFallback={result.is_fallback}
              providerUsed={result.provider_used}
            />

            {/* Concrete High-Impact First Action Banner */}
            <FirstAction actionText={result.first_action} />

            {/* Recommended Issue Card */}
            <RecommendationCard
              recommendedIssue={result.recommended_issue}
              repository={result.repository}
            />

            {/* Grid: Why AI Chose This & Skill Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WhyRecommended reasons={result.why_this_issue} />
              <SkillMatch
                userSkills={result.user_skills}
                skillsRequired={result.recommended_issue?.skills_required}
                skillsToLearn={result.skills_to_learn}
              />
            </div>

            {/* Where you'll probably work: Relevant Files */}
            <RelevantFiles
              relevantFiles={result.recommended_issue?.relevant_files}
              repository={result.repository}
            />

            {/* Step-by-Step Contribution Roadmap */}
            <ContributionRoadmap roadmap={result.roadmap} />

            {/* Learning Outcomes & Risks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LearningSection learningItems={result.what_you_will_learn} />
              <RiskSection risks={result.risks} />
            </div>

            {/* Interactive AI Mentor Chat */}
            <AIMentor
              repository={result.repository}
              recommendedIssue={result.recommended_issue}
              fullRecommendation={result}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
