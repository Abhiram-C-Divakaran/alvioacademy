import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import AuthGuard from './components/layout/AuthGuard';
import LandingPage from './features/landing/LandingPage';
import AuthPage from './features/auth/AuthPage';
import DashboardPage from './features/dashboard/DashboardPage';
import WorkspacePage from './features/workspace/WorkspacePage';
import AiTutorPage from './features/ai-tutor/AiTutorPage';
import MockInterviewPage from './features/ai-tutor/MockInterviewPage';
import QuizPage from './features/quiz/QuizPage';
import ProfilePage from './features/profile/ProfilePage';
import ProgressPage from './features/progress/ProgressPage';
import CatalogPage from './features/catalog/CatalogPage';
import CodingPage from './features/coding/CodingPage';
import VisualizerPage from './features/visualizer/VisualizerPage';
import VideoLearningPage from './features/video-learning/VideoLearningPage';
import SkillTreeMap from './features/learn/SkillTreeMap';
import PvPShowdown from './features/workspace/PvPShowdown';

import DataStructuresHubPage from './features/learn/DataStructuresHubPage';
import ArrayPage from './features/learn/ArrayPage';
import LinkedListPage from './features/learn/LinkedListPage';
import StackPage from './features/learn/StackPage';
import QueuePage from './features/learn/QueuePage';
import BinaryTreePage from './features/learn/BinaryTreePage';
import AvlTreePage from './features/learn/AvlTreePage';
import GraphPage from './features/learn/GraphPage';
import HashTablePage from './features/learn/HashTablePage';
import HeapPage from './features/learn/HeapPage';

import AlgorithmsHubPage from './features/learn/AlgorithmsHubPage';

import SortingHubPage from './features/learn/SortingHubPage';
import SearchingHubPage from './features/learn/SearchingHubPage';
import AlgorithmDetailsPage from './features/learn/AlgorithmDetailsPage';
import AlgorithmVisualizerPage from './features/visualizer/AlgorithmVisualizerPage';
import Complexity3DPage from './features/learn/Complexity3DPage';


import DivideConquerPage from './features/learn/DivideConquerPage';
import DynamicProgrammingPage from './features/learn/DynamicProgrammingPage';
import GreedyPage from './features/learn/GreedyPage';
import GraphAlgorithmsPage from './features/learn/GraphAlgorithmsPage';
import TopicDetailsPage from './features/learn/TopicDetailsPage';
import AIVisualizerPage from './features/visualizer/AIVisualizerPage';


import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected/App Routes wrapped in Layout & Auth Guard */}
        <Route element={<AuthGuard />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/skill-tree" element={<SkillTreeMap />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/workspace" element={<WorkspacePage />} />
            <Route path="/workspace/pvp" element={<PvPShowdown />} />
            <Route path="/ai-tutor" element={<AiTutorPage />} />
            <Route path="/mock-interview" element={<MockInterviewPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/coding" element={<CodingPage />} />
            <Route path="/3d-visualizer" element={<VisualizerPage />} />
            <Route path="/algorithms-visualizer" element={<AlgorithmVisualizerPage />} />
            <Route path="/video-learning" element={<VideoLearningPage />} />
            
            <Route path="/learn" element={<SkillTreeMap />} />
            <Route path="/learn/data-structures" element={<DataStructuresHubPage />} />
            <Route path="/learn/ai-visualizer" element={<AIVisualizerPage />} />
            <Route path="/learn/array" element={<ArrayPage />} />
            <Route path="/learn/linked-list" element={<LinkedListPage />} />
            <Route path="/learn/stack" element={<StackPage />} />
            <Route path="/learn/queue" element={<QueuePage />} />
            <Route path="/learn/binary-tree" element={<BinaryTreePage />} />
            <Route path="/learn/avl-tree" element={<AvlTreePage />} />
            <Route path="/learn/graph" element={<GraphPage />} />
            <Route path="/learn/hash-table" element={<HashTablePage />} />
            <Route path="/learn/heap" element={<HeapPage />} />

            <Route path="/learn/algorithms" element={<AlgorithmsHubPage />} />
            <Route path="/learn/sorting" element={<SortingHubPage />} />
            <Route path="/learn/searching" element={<SearchingHubPage />} />
            <Route path="/learn/algorithms/:algo" element={<AlgorithmDetailsPage />} />
            <Route path="/learn/complexity" element={<Complexity3DPage />} />
            <Route path="/learn/divide-conquer" element={<DivideConquerPage />} />
            <Route path="/learn/dynamic-programming" element={<DynamicProgrammingPage />} />
            <Route path="/learn/greedy" element={<GreedyPage />} />
            <Route path="/learn/graph-algorithms" element={<GraphAlgorithmsPage />} />
            <Route path="/learn/skill-tree" element={<SkillTreeMap />} />
            <Route path="/learn/topic/:topicId" element={<TopicDetailsPage />} />


            <Route path="/workspace/pvp" element={<PvPShowdown />} />
            <Route path="/coding" element={<CodingPage />} />
            <Route path="/3d-visualizer" element={<VisualizerPage />} />
            <Route path="/video-learning" element={<VideoLearningPage />} />
            <Route path="/ai-tutor" element={<AiTutorPage />} />
            <Route path="/mock-interview" element={<MockInterviewPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/progress" element={<ProgressPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
