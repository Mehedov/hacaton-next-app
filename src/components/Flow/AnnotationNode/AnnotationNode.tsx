import { memo } from 'react';
import { MoveDown } from 'lucide-react';

interface AnnotationData {
  label: string;
  arrowStyle?: string;
}

function AnnotationNode({ data }: { data: AnnotationData }) {
  return (
    <>
      <div className="annotation-content">
        <div>{data.label}</div>
      </div>
      {data.arrowStyle && (
        <div className={`annotation-arrow ${data.arrowStyle}`}>
          <MoveDown />
        </div>
      )}
    </>
  );
}

export { AnnotationNode };
export default memo(AnnotationNode);
