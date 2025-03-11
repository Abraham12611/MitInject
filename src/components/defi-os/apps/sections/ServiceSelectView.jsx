import React, { useMemo } from 'react';
import { Search, ArrowLeft, ChevronDown } from 'lucide-react';
import { useTransition, animated } from '@react-spring/web';
import ServiceButton from '../common/ServiceButton';

const ServiceSelectView = React.memo(({ 
  mode = 'trigger',
  services,
  searchQuery,
  onSearchChange,
  onBack,
  onSelect,
  getServiceColors,
  theme
}) => {
  const filteredServices = useMemo(() => 
    services.filter(service => 
      service.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [services, searchQuery]
  );

  const transitions = useTransition(filteredServices, {
    from: { opacity: 0, transform: 'scale(0.9)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0.9)' },
    keys: service => service.id,
    config: { tension: 300, friction: 20 }
  });

  return (
    <div className="h-full flex flex-col items-center p-6">
      {/* Back Button */}
      <div className="w-full max-w-xl flex justify-between mb-8">
        <button
          className="px-4 py-2 rounded-full border-2 flex items-center gap-2"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-8">Choose a service</h1>

      {/* Service Filter */}
      <button className="w-full max-w-xl mb-4 p-4 rounded-xl bg-white/5 
                        flex items-center justify-between">
        <span className="text-xl">All services</span>
        <ChevronDown className="w-6 h-6" />
      </button>

      {/* Search */}
      <div className="w-full max-w-xl mb-8">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 opacity-40" />
          <input
            type="text"
            placeholder="Search services"
            className="w-full p-4 pl-12 rounded-xl bg-white/5 outline-none"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Recommended Section */}
      <div className="w-full max-w-xl">
        <h2 className="text-xl font-semibold mb-4">Recommended</h2>
        <div className="grid grid-cols-5 gap-4">
          {transitions((style, service) => (
            <animated.div style={style} key={service.id}>
              <ServiceButton 
                service={service} 
                onSelect={onSelect}
                getServiceColors={getServiceColors}
              />
            </animated.div>
          ))}
        </div>
      </div>
    </div>
  );
});

ServiceSelectView.displayName = 'ServiceSelectView';

export default ServiceSelectView; 