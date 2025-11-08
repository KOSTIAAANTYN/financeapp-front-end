import React from 'react'
import Button from 'components/Button';

type SaveType = {
    isMonthly: boolean
    addToHistory: () => void
}

function Save({isMonthly, addToHistory}: SaveType) {


  return (
    <Button fc={addToHistory} text={`Save current ${isMonthly ? 'month' : 'week'}`} />
  )
}

const MemoSave = React.memo(Save, (prevProps, nextProps) => {
  return prevProps.isMonthly === nextProps.isMonthly;
});

export default MemoSave

