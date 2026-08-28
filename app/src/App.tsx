import { Routes, Route } from 'react-router';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Program from '@/pages/Program';
import Lesson from '@/pages/Lesson';
import Practice from '@/pages/Practice';
import Cheatsheet from '@/pages/Cheatsheet';
import Faq from '@/pages/Faq';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="program" element={<Program />} />
        <Route path="lesson/:lessonId" element={<Lesson />} />
        <Route path="practice" element={<Practice />} />
        <Route path="cheatsheet" element={<Cheatsheet />} />
        <Route path="faq" element={<Faq />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
