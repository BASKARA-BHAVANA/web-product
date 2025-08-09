import React from 'react';

const HeroTitle = () => {
  return (
    <div className="mb-12 flex flex-col items-center -space-y-3">
      <div className="bg-primary flex items-center gap-3 rounded-lg p-3">
        <p className="typo-large bg-primary-foreground text-primary rounded-sm px-2">
          Materi Belajar
        </p>
      </div>
      <h1 className="typo-h1 bg-primary w-fit rounded-lg p-3 text-center">
        Eksplorasi Dunia Informatika
      </h1>
    </div>
  );
};

export default HeroTitle;
