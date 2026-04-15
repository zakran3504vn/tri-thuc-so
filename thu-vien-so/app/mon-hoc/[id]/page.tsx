import SubjectDetail from './SubjectDetail';

export async function generateStaticParams() {
  return [
    { id: 'toan' }, { id: 'van' }, { id: 'anh' }, { id: 'khoa-hoc' },
    { id: 'lich-su' }, { id: 'dia-ly' }, { id: 'tin-hoc' }, { id: 'am-nhac' }, { id: 'my-thuat' },
  ];
}

export default function SubjectPage({ params }: { params: { id: string } }) {
  return <SubjectDetail subjectId={params.id} />;
}
