import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { useCart } from '../components/CartContext';
import { getAllServices, getServiceCategories, getPackagesByService, getAddOns } from '../api/services';

const ServicesBrowser = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [addOns, setAddOns] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedService, setSelectedService] = useState(null);
  const [servicePackages, setServicePackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [servicesRes, categoriesRes, addOnsRes] = await Promise.all([
        getAllServices(),
        getServiceCategories(),
        getAddOns()
      ]);
      
      if (servicesRes.success) {
        setServices(servicesRes.data);
      }
      if (categoriesRes.success) {
        setCategories(categoriesRes.data);
      }
      if (addOnsRes.success) {
        setAddOns(addOnsRes.data);
      }
    } catch (err) {
      setError('Error fetching data');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchServicePackages = async (serviceId) => {
    try {
      const response = await getPackagesByService(serviceId);
      if (response.success) {
        setServicePackages(response.data);
      }
    } catch (err) {
      console.error('Error fetching packages:', err);
    }
  };

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category?._id === selectedCategory);

  const handleServiceSelect = async (service) => {
    setSelectedService(service);
    setSelectedPackage(null);
    setSelectedAddOns([]);
    await fetchServicePackages(service._id);
    setShowServiceModal(true);
  };

  const handleAddOnToggle = (addOn) => {
    setSelectedAddOns(prev => {
      const exists = prev.find(a => a._id === addOn._id);
      if (exists) {
        return prev.filter(a => a._id !== addOn._id);
      } else {
        return [...prev, addOn];
      }
    });
  };

  const calculateTotal = () => {
    let total = selectedService?.basePrice || 0;
    if (selectedPackage) {
      total = selectedPackage.price;
    }
    total += selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0);
    return total;
  };

  const handleAddToCart = () => {
    if (!selectedService) return;

    const cartItem = {
      id: `service-${selectedService._id}-${Date.now()}`,
      type: 'service',
      service: selectedService,
      package: selectedPackage,
      addOns: selectedAddOns,
      basePrice: selectedService.basePrice,
      packagePrice: selectedPackage?.price || 0,
      addOnsTotal: selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0),
      total: calculateTotal(),
      quantity: 1
    };

    addToCart(cartItem);
    setShowServiceModal(false);
    
    // Show success message
    alert('Service added to cart successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Services</h1>
          <p className="text-gray-600">Choose from our comprehensive range of services</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-md ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Services
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => setSelectedCategory(category._id)}
                className={`px-4 py-2 rounded-md ${
                  selectedCategory === category._id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div key={service._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {service.image && (
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                  <span className="text-lg font-bold text-blue-600">₹{service.basePrice}</span>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {service.category?.name}
                  </span>
                  <button
                    onClick={() => handleServiceSelect(service)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No services found in this category.</p>
          </div>
        )}

        {/* Service Details Modal */}
        {showServiceModal && selectedService && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{selectedService.name}</h3>
                <button
                  onClick={() => setShowServiceModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  {selectedService.image && (
                    <img
                      src={selectedService.image}
                      alt={selectedService.name}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                  )}
                  <p className="text-gray-600 mb-4">{selectedService.description}</p>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Base Service Features:</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {selectedService.features?.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold mb-4">Customize Your Service</h4>
                    
                    {/* Package Selection */}
                    {servicePackages.length > 0 && (
                      <div className="mb-6">
                        <h5 className="font-medium text-gray-900 mb-3">Choose Package:</h5>
                        <div className="space-y-3">
                          <label className="flex items-center p-3 border rounded-lg cursor-pointer">
                            <input
                              type="radio"
                              name="package"
                              checked={!selectedPackage}
                              onChange={() => setSelectedPackage(null)}
                              className="mr-3"
                            />
                            <div>
                              <div className="font-medium">Basic Service</div>
                              <div className="text-sm text-gray-600">₹{selectedService.basePrice}</div>
                            </div>
                          </label>
                          {servicePackages.map((pkg) => (
                            <label key={pkg._id} className="flex items-center p-3 border rounded-lg cursor-pointer">
                              <input
                                type="radio"
                                name="package"
                                checked={selectedPackage?._id === pkg._id}
                                onChange={() => setSelectedPackage(pkg)}
                                className="mr-3"
                              />
                              <div>
                                <div className="font-medium">{pkg.name}</div>
                                <div className="text-sm text-gray-600">₹{pkg.price}</div>
                                <div className="text-xs text-gray-500">{pkg.description}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add-ons Selection */}
                    {addOns.length > 0 && (
                      <div className="mb-6">
                        <h5 className="font-medium text-gray-900 mb-3">Add-ons:</h5>
                        <div className="space-y-2">
                          {addOns.map((addOn) => (
                            <label key={addOn._id} className="flex items-center p-2 border rounded cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedAddOns.some(a => a._id === addOn._id)}
                                onChange={() => handleAddOnToggle(addOn)}
                                className="mr-3"
                              />
                              <div className="flex-1">
                                <div className="font-medium">{addOn.name}</div>
                                <div className="text-sm text-gray-600">₹{addOn.price}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Total and Add to Cart */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-xl font-bold text-blue-600">₹{calculateTotal()}</span>
                      </div>
                      <button
                        onClick={handleAddToCart}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
                        disabled={!user}
                      >
                        {user ? 'Add to Cart' : 'Login to Book'}
                      </button>
                      {!user && (
                        <p className="text-sm text-gray-500 mt-2 text-center">
                          Please login to book services
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesBrowser;
