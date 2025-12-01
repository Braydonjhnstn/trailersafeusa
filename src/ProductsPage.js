import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ProductsPage.css';
import { shopifyRequest, SHOPIFY_QUERIES, transformProduct, SHOPIFY_CONFIG } from './shopifyConfig';
import { useCart } from './CartContext';
import Footer from './Footer';

function ProductsPage() {
  console.log('ProductsPage component rendering');
  const { addToCart, getCartItemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Remove home-page class and allow scrolling on products page
  useEffect(() => {
    document.body.classList.remove('home-page');
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    return () => {
      // Cleanup if needed
    };
  }, []);
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(null); // null = no search performed, [] = search performed with no results
  const [currentTrackSizes, setCurrentTrackSizes] = useState([]); // Track sizes for the current search (array to handle multiple)
  const [searchError, setSearchError] = useState(null); // Error message if search fails

  // Fallback products in case Shopify API fails
  const getFallbackProducts = () => [
    {
      id: 1,
      title: "Heavy Duty Track Covers",
      price: "$89.99",
      compareAtPrice: "$119.99",
      image: "/trackcover.png",
      description: "Premium protection for your equipment tracks",
      variants: [
        { id: 1, title: "Small", price: "$79.99" },
        { id: 2, title: "Medium", price: "$89.99" },
        { id: 3, title: "Large", price: "$99.99" }
      ],
      tags: ["Heavy Duty", "Weather Resistant", "Durable"]
    },
    {
      id: 2,
      title: "Equipment Protection Kit",
      price: "$149.99",
      compareAtPrice: "$199.99",
      image: "/excavator.jpg",
      description: "Complete protection solution for heavy machinery",
      variants: [
        { id: 4, title: "Standard", price: "$149.99" },
        { id: 5, title: "Premium", price: "$179.99" }
      ],
      tags: ["Complete Kit", "Multi-Purpose", "Professional"]
    },
    {
      id: 3,
      title: "Custom Track Covers",
      price: "From $199.99",
      compareAtPrice: null,
      image: "/trackcover.png",
      description: "Custom-sized covers for specific equipment",
      variants: [
        { id: 6, title: "Custom Size", price: "Contact for Quote" }
      ],
      tags: ["Custom", "Made to Order", "Professional"]
    }
  ];


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Step 1: Validate Shopify configuration
        if (!SHOPIFY_CONFIG || !SHOPIFY_CONFIG.domain || !SHOPIFY_CONFIG.storefrontAccessToken) {
          console.warn('Shopify configuration is missing, using fallback data');
          setProducts(getFallbackProducts());
          setLoading(false);
          return;
        }

        // Step 2: Validate required functions exist
        if (!shopifyRequest || !SHOPIFY_QUERIES || !SHOPIFY_QUERIES.getProducts) {
          console.warn('Shopify functions not available, using fallback data');
          setProducts(getFallbackProducts());
          setLoading(false);
          return;
        }

        // Step 3: Attempt to fetch from Shopify API with timeout
        console.log('Attempting to fetch products from Shopify...');
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        );
        
        const apiPromise = shopifyRequest(SHOPIFY_QUERIES.getProducts, { first: 20 });
        
        const data = await Promise.race([apiPromise, timeoutPromise]);
        
        // Step 4: Validate and transform the response
        if (data && data.products && data.products.edges && Array.isArray(data.products.edges) && data.products.edges.length > 0) {
          console.log(`Successfully fetched ${data.products.edges.length} products from Shopify`);
          
          const transformedProducts = data.products.edges
            .map(edge => {
              try {
                if (!edge || !edge.node) {
                  console.warn('Invalid product edge structure:', edge);
                  return null;
                }
                return transformProduct(edge);
              } catch (transformErr) {
                console.error('Error transforming product:', transformErr, edge);
                return null;
              }
            })
            .filter(product => product !== null && product !== undefined); // Remove any null/undefined values
          
          if (transformedProducts.length > 0) {
            console.log(`Successfully transformed ${transformedProducts.length} products`);
            setProducts(transformedProducts);
          } else {
            console.warn('No valid products after transformation, using fallback data');
            setProducts(getFallbackProducts());
          }
        } else {
          console.warn('No products found in Shopify response, using fallback data');
          setProducts(getFallbackProducts());
        }
        
        setLoading(false);
      } catch (err) {
        // Always fallback to mock data on any error
        console.error('Error fetching products from Shopify:', err);
        console.log('Falling back to mock product data');
        setProducts(getFallbackProducts());
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setQuantity(1);
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value) || 1;
    setQuantity(Math.max(1, newQuantity));
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct, quantity);
    handleCloseModal();
  };

  const handleBuyNow = () => {
    if (!selectedProduct) return;
    // TODO: Implement Shopify checkout API integration
    console.log(`Buying ${quantity} of product ${selectedProduct.id} now`);
    alert(`Redirecting to checkout for ${quantity} ${selectedProduct.title}... (Demo mode)`);
    handleCloseModal();
  };

  const handleMakeChange = (e) => {
    const make = e.target.value;
    setSelectedMake(make);
    setSelectedModel(''); // Reset model when make changes
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  // Model options based on selected make
  const getModelOptions = () => {
    const modelMap = {
      'bobcat': ['T190', 'T550', 'T590','T180', 'T190', 'T550', 'T570', 'T590','S130','864','864FG','864G','T200','T630','T650','T300','T320','T750','T250', 'T300', 'T320', 'T730', 'T740', 'T750', 'T760', 'T770','T830', 'T870','873', '883','E25','E35 SERIES','T630','220', 'MT85', '325', '325D', '325G', '328', '328D', '328G','329', '331','337', '337D', '337G', '341', '341D','435','E45', 'E50', 'E55','864', '864FG', '864G', 'S150', 'S160', 'S175', 'S185', 'S205','T200', 'T630', 'T650', 'E60', 'E63','331', '331D', '331E', '331G', '334', '334D', '334G','425', '428', 'E26', 'E32', 'E32C', '329', '331', '331D', '331E', '331G', '334', '334D', '334G', '425', '428', 'E26', 'E32', 'E32C', 'X331', 'E80','E85'],
      'case': ['50', '50 MAXI', '50 RTB','70XT', '75XT', 'CK32', 'CK30C', 'CX27B','CK36','CK50', 'CK52', 'CX36B','CX55B', 'CX50', 'CX50B','CK62', 'CK82','445CT', '450CT','445 CT', '450 CT', 'TR320', 'TR340', 'TV370', 'TV380','420 CT', 'TR270', 'TR310','35', '35 MAXI', '35 STB', 'CK35','1840', '1845', '1845B', '1845C','CX60C', 'CX75R', 'CX75SR', 'CX80'],
      'caterpillar': ['236', '236B', '246', '248', '248B', '279D', '289C-2', '289D','239D', '249B', '249D','242', '246B','257D','259D','279C2', '279D', '289D','246C', '256C', '262C', '268B', '279C', '289C', '299D', '299D2','299D3', '299D XHP', '299D2 XHP', '299C','300.9D','301.5', 'MM15T','301.5CR', '301.6C', '301.7D', '301.8C','302.5', '302.5C', '302.5CR', '302.7D', 'MM25T','303.5', '303CR','303E-CR', 'MM35', 'MM35A', 'MM35B', 'MM35T','MM40SR', 'MX35','304.5', '304C', '304CR', '305', '305CR', 'MM40CR', 'MM40CR-2', 'MM40T', 'MM45', 'MM45B', 'MM45T', 'MM46','MM55SR', 'MM55SR-2','304C-CR', '305.5D-CR', '305.5E2-CR', '305.5E-CR', '305C-CR', '305D-CR', '305E2-CR', '305E-CR','307B', '307C','308C-CR','MS10'],
      'ditch-witch': ['JT30','JT2720','MX202','MX272','MX502','SK755','SK800','SK1050','SK850','SK750','SK752','XT850'],
      'doosan': ['DX27Z','DX30','DX30Z','DX60','DX60-R','DX62R','DX63R','DX80','DX80-R','DX85-R','DX55'],
      'gehl': ['CTL55','CTL80','CTL85','363','GE342','GE363','353','373','383Z','GE353','GE373','MB358','GX10','4635','603','4640','6635','6640','RT250','RT255','VT320 SKID STEER VTS SYSTEMS','4840','5635','5640','RT185','RT175','M135','MB1135','MB1135S','MB145','MB165','GX35','503Z','GE502','GE602','Z35'],
      'hitachi': ['EX15SR','UE15','EX27U','EX29U','EX35','EX35-1','EX40UR','ZX25 ZAXIS','ZX26U-5','ZX50U ZAXIS','EX33','EX40','EX40-2','EX40U','EX45','EX45-2','EX50','EX50-1','EX50U','EX50URG','EX55UR','EX55URG','FH40.2','FH40.2 PLUS','FH45.2','HX99B','SH45-2','ZX40 ZAXIS','ZX50 ZAXIS','ZX50U ZAXIS','ZX55U ZAXIS','EX58MU','ZX60U-3','ZX85USBLC','EX55','EX60','EX60-2','EX60-3','EX60G','EX60UR','EX60LC-2','EX60LC-3','EX60URG-2','EX75UR','EX75UR-3','EX75UU'],
      'jcb': ['190T ECO','205T ECO','2TS-7T','260T','320T ECO','803','803E','803 PLUS','803 SUPER','8030ZTS','8032Z','8035Z','8035ZTS','8045ZTS','8052','8060','8080ZTS'],
      'john-deere': ['317G','317 VTS SYSTEM','320 VTS SYSTEM','325 VTS SYST','328 VTS SYST','329D','329E','333D','333E','333G','CT332','332VTS SYSTEM','319D','319E','323D','323E','CT322','27C ZTS','26G','27D','50C ZTS','50D','50G','60D','60G','75C'],
      'kobelco': ['SK27','SK27SR-3','SK27SR ACER TR4','SK35SR TIER IV','SK35SR-3','SK035','SK035 COUPE','SK035-1','SK035-3','BB69','SK042','SK042-1','SK045','SK045 COUPE','SK045-1','SK45SR','SK45SR-2','SK45-1','SK50','SK50-1','SK50UR-1','SK50UR-2','Z16','SK50UR','50SR ACERA TR4','SK50SR-3','SK060','SK60','SK60-1','SK60-2','SK60-3','SK60-UR','SK60V','SK70SR','SK70SR-1E','SK75UR','SK75UR-1','SK75-3','SK80CS-1E','SK80MSR','SK80-CS','SK70-SR2'],
      'komatsu': ['PC15FR-1','PC15','PC15-2','PC15-3','PC15-6','PC15 AVANCE R','PC20R','PC27MR-2','PC27MR-3','PC15-7','PC20 MRX UTILITY','PC20-6','PC30-6','PC30-7','PC30R','PC30R-8','PC30MRX','PC35','PC35R','PC35-8','PC35MR-1','PC35MRX','PC38','PC38-2','PC38UU-2','PC38-2 AVANCE R','PC40 AVANCE R','PC40 FR-1','PC40 MR-1','PC40 R-8','PC40-7E','PC45','PC45 AVANCE R','PC45 MR-1','PC45 MRX','PC45 R','PC45 R UTILITY','PC45 R-8','PC50 FR-1','PC50 UU-2','PC50 UU-2E','PC50-2','PC50-2 AVANCE R','PC40MR-2','PC45MR-3','PC50MR','PC50MR-2','PC55MR','PC55MR-3','PC58UU-3','SK820 B VTS','SK1020','820 TRUBO','CK20','CK20-1','CK25-1','SK1020 VTS SYST','1020 TURBO','CK30-1','CK35-1','CK35'],
      'kubota': ['KC120','KH012G','KH012HG','KH05','KH12','KH28','KH31','KH35','KH36','KH37','KH38','KH5','AR30','K028','K030','KH030','KH030G','KH030HG','KH033','KX030','KX033-1','KX033-4','KX71-2','KX71-3','KX91','KX91-2','U25-3','U25-3G','U27-4','K035','K035-3','KH033HG','KH090','KX101-3','U30','U30-3','U35','U35-3','U35-4','U35S','U35-3S','KH033','KH101','KH90','KX033','KX101','KX90','RX301','RX302','RX303','KH191','K040','K045','K151','KH040','KH045','KH130','KH151','KH52SR','KX040','KX151','KX161-2','U45','U45G','U45VA','SVL75','SVL75-2','SVL75-2C','SVL90','SVL95','SVL95-2','KX045','KX161-3','KX057-4','RX501','RX502','U45-3','U55','U55-4','U55-4S','KH055','KH055N','KX080-4','KX080-3'],
      'takeuchi': ['TL6','TL8','TL130','TL230','TL230-2','TL10','TL140','TL240','TL12','TL150','TL250','TB016','TB035','TB135','TB135FR','TB235','TB240','TB045','TB145','TB153FR','TB250A','TB53FR','TB250','TB55R','TB55UR','TB070','TB175','TB180FR','TB185FR','TB285','TB285FR','TB290','TB80FR','TL126','TL26','TL26-2','TL120','TL220','TL10V2','TL12V2','TL12R2'],
      'terex': ['AR35','HR16','TC25','TC35','HR14','TC29','TC48','TC50','TC55'],
      'volvo': ['EC35','ECR38','EC55','EC55B','EC55C','ECR58','ECR85','EC88','ERC48C','MC70','MC80','MC90','MC110','MC110B','MCT110C','MCT125C','MTC135C','MTC145C','MCT85C'],
    };
    return modelMap[selectedMake] || [];
  };

  // Track size to models mapping - defined outside function for efficiency
  // Each track size maps to an array of models that use that track size
  // NOTE: All duplicate track sizes have been merged into single arrays
  const trackSizeToModelsMap = {
    'track-sizes': {
      '15x4x42': ['257D'],
      '180x72x37': ['300.9D'],
      '180x72x44': ['SK850', 'SK750', 'SK752'],
      '200x72x42': ['KH012G', 'KH012HG', 'KH05', 'KH12', 'KH28', 'KH31', 'KH35', 'KH36', 'KH37', 'KH38', 'KH5', 'GX10', 'EX15SR', 'UE15'],
      '230x72x44': ['SK755', 'SK800', 'SK1050'],
      '230x72x47': ['PC15FR-1'],
      '230x96x31': ['301.5', 'MM15T'],
      '230x96x34': ['TB016'],
      '230x96x35': ['301.5CR', '301.6C', '301.7D', '301.8C'],
      '250x72x45': ['KC120', '220', 'MT85', 'XT850', 'M135', 'MB1135', 'MB1135S', 'MB145', 'MB165', 'MS10'],
      '300x52.5Kx80': ['331', '331D', '331E', '331G', '334', '334D', '334G', '425', '428', 'E26', 'E32', 'E32C'],
      '300x52.5N80': ['AR35', 'HR16', 'TC25', 'TC35'],
      '300x52.5Nx74': ['325', '325D', '325G', '328', '328D', '328G', 'HR14', 'TC29', 'ZX25 ZAXIS'],
      '300x52.5Nx78': ['27C ZTS', 'E25', 'PC15-7', 'PC20 MRX UTILITY', 'EX27U', 'EX29U'],
      '300x52.5Nx80': ['CK32', 'CK30C', 'CX27B', 'AR30', 'K028', 'K030', 'KH030', 'KH030G', 'KH030HG', 'KH033', 'KX030', 'KX033-1', 'KX033-4', 'KX71-2', 'KX71-3', 'KX91', 'KX91-2', 'U25-3', 'U25-3G', 'U27-4', '26G', '27D', '329', '331', '331D', '331E', '331G', '334', '334D', '334G', '425', '428', 'E26', 'E32', 'E32C', 'X331', 'SK27', 'SK27SR-3', 'SK27SR ACER TR4', 'MX202', 'MX272', '363', 'GE342', 'GE363', 'PC15', 'PC15-2', 'PC15-3', 'PC15-6', 'PC15 AVANCE R', 'PC20R', 'PC27MR-2', 'PC27MR-3', 'ZX26U-5', 'DX27Z'],
      '300x52.5Nx84': ['K035', 'K035-3', 'KH033HG', 'KH090', 'KX101-3', 'U30', 'U30-3', 'U35', 'U35-3', 'U35-4', 'U35S', 'U35-3S', 'E35 SERIES', '303.5', '303CR', 'PC20-6', 'PC30-6', 'PC30-7', 'PC30R', 'PC30R-8', 'PC30MRX', 'PC35', 'PC35R', 'PC35-8', 'PC35MR-1', 'PC35MRX', 'PC38', 'PC38-2', 'PC38UU-2', 'PC38-2 AVANCE R', 'EX35', 'EX35-1', 'EX40UR', 'DX30', 'DX30Z'],
      '300x52.5Nx88': ['CX36B', 'SK35SR TIER IV', 'SK35SR-3', 'Z35'],
      '300x52.5Nx98': ['JT30', 'JT2720'],
      '300x52.5Wx78': ['302.5', '302.5C', '302.5CR', '302.7D', 'MM25T'],
      '300x52.5Wx84': ['CK36', '803', '803E', '803 PLUS', '803 SUPER', '8030ZTS', '8032Z', '8035Z', '8035ZTS', 'KH033', 'KH101', 'KH90', 'KX033', 'KX101', 'KX90', 'RX301', 'RX302', 'RX303', 'EC35', 'ECR38', '353', '373', '383Z', 'GE353', 'GE373', 'MB358', '303E-CR', 'MM35', 'MM35A', 'MM35B', 'MM35T', 'MM40SR', 'MX35', 'EX33'],
      '320x86Kx46': ['TL120', 'TL220', 'CTL55'],
      '320x86Kx48': ['TL126', 'TL26', 'TL26-2'],
      '320x86x49': ['T190', 'T550', 'T590', 'T180', 'T570'],
      '320x86x50': ['TL6', '420CT', 'TR270', 'TR310', '190T ECO', '205T ECO', '2TS-7T', '317G', 'S130'],
      '320x86x51': ['SK820 B VTS'],
      '320x86x52': ['TL8', 'TL130', 'TL230', 'TL230-2', 'TL10V2', '1840', '1845', '1845B', '1845C', '319D', '319E', '323D', '323E', 'CT322', '864', '864FG', '864G', 'S150', 'S160', 'S175', 'S185', 'S205', 'T200', 'T630', 'T650', 'MC70', 'MC80', '4640', '820 TRUBO', 'CK20', 'CK20-1', 'CK25-1', 'SK1020 VTS SYST'],
      '320x86x53': ['259D'],
      '320x86x54': ['317 VTS SYSTEM', '320 VTS SYSTEM', '4840', '5635', '5640', 'RT185', 'RT175', '242', '246B'],
      '350x52.5x86': ['TB035', 'TB135', 'TB135FR', 'TB235', 'TB240', '35', '35 MAXI', '35 STB', 'CK35'],
      '350x52.5x87': ['SK035', 'SK035 COUPE', 'SK035-1', 'SK035-3'],
      '350x86x50': ['MCT85C', '4635'],
      '400x72.5Nx72': ['TB55R', 'TB55UR', '50C ZTS', 'BB69', 'SK042', 'SK042-1', 'SK045', 'SK045 COUPE', 'SK045-1', 'SK45SR', 'SK45SR-2', 'SK45-1', 'SK50', 'SK50-1', 'SK50UR-1', 'SK50UR-2', 'Z16', '50SR ACERA TR4', 'SK50SR-3', 'PC40 AVANCE R', 'PC40 FR-1', 'PC40 MR-1', 'PC40 R-8', 'PC40-7E', 'PC45', 'PC45 AVANCE R', 'PC45 MR-1', 'PC45 MRX', 'PC45 R', 'PC45 R UTILITY', 'PC45 R-8', 'PC50 FR-1', 'PC50 UU-2', 'PC50 UU-2E', 'PC50-2', 'PC50-2 AVANCE R'],
      '400x72.5Nx74': ['TB045', 'TB145', 'TB153FR', 'TB250A', 'TB53FR', 'TB250', 'CX55B', 'CX50', 'CX50B', '8045ZTS', '8052', '8060', '50D', '50G', 'SK50UR', '603', '503Z', 'GE502', 'GE602', 'PC40MR-2', 'PC45MR-3', 'PC50MR', 'PC50MR-2', 'PC55MR', 'PC55MR-3', 'PC58UU-3', 'ZX50U ZAXIS', 'EX58MU', 'ZX60U-3'],
      '400x72.5Wx72': ['50', '50 MAXI', '50 RTB', 'K040', 'K045', 'K151', 'KH040', 'KH045', 'KH130', 'KH151', 'KH52SR', 'KX040', 'KX151', 'KX161-2', 'U45', 'U45G', 'U45VA', 'TC48', 'TC50', 'TC55', 'ERC48C', 'GX35', '304.5', '304C', '304CR', '305', '305CR', 'MM40CR', 'MM40CR-2', 'MM40T', 'MM45', 'MM45B', 'MM45T', 'MM46', 'MM55SR', 'MM55SR-2', 'EX40', 'EX40-2', 'EX40U', 'EX45', 'EX45-2', 'EX50', 'EX50-1', 'EX50U', 'EX50URG', 'EX55UR', 'EX55URG', 'FH40.2', 'FH40.2 PLUS', 'FH45.2', 'HX99B', 'SH45-2', 'ZX40 ZAXIS', 'ZX50 ZAXIS', 'ZX50U ZAXIS', 'ZX55U ZAXIS'],
      '400x72.5Wx73': ['329', '331'],
      '400x72.5Wx74': ['CK50', 'CK52', 'KX045', 'KX161-3', 'KX057-4', 'RX501', 'RX502', 'U45-3', 'U55', 'U55-4', 'U55-4S', '60D', '60G', '337', '337D', '337G', '341', '341D', '435', 'E45', 'E50', 'E55', 'EC55', 'EC55B', 'EC55C', 'ECR58', 'MX502', 'DX55'],
      '400x72.5Wx76': ['CX60C', 'KH055', 'KH055N', 'E60', 'E63', '304C-CR', '305.5D-CR', '305.5E2-CR', '305.5E-CR', '305C-CR', '305D-CR', '305E2-CR', '305E-CR', 'EX55', 'DX60', 'DX60-R', 'DX62R', 'DX63R'],
      '400x86Kx52': ['TL8', 'TL130', 'TL230', 'TL230-2'],
      '400x86x49': ['239D', '249B', '249D'],
      '400x86x52': ['SVL75', 'SVL75-2', 'SVL75-2C', 'T630'],
      '400x86x53': ['259D'],
      '400x86x55': ['445CT', '450CT', 'T300', 'T320', 'T750'],
      '450x100Kx48': ['TL10', 'TL140', 'TL240'],
      '450x100Kx50': ['TL12', 'TL150', 'TL250', 'CTL80', 'CTL85'],
      '450x81Nx76': ['8080ZTS', 'KX080-4', 'KX080-3', '75C', 'SK060', 'SK60', 'SK60-1', 'SK60-2', 'SK60-3', 'SK60-UR', 'SK60V', 'SK70SR', 'SK70SR-1E', 'SK75UR', 'SK75UR-1', 'SK75-3', 'SK80CS-1E', 'SK80MSR', 'SK80-CS', 'SK70-SR2', '308C-CR', 'ZX85USBLC', 'EX60LC-2', 'EX60LC-3', 'EX60URG-2', 'EX75UR', 'EX75UR-3', 'EX75UU'],
      '450x81Wx72': ['CK62', 'CK82', 'KH191', '307B', '307C', 'EX60', 'EX60-1', 'EX60-2', 'EX60-3', 'EX60G', 'EX60UR'],
      '450x81Wx76': ['TB070', 'TB175', 'TB180FR', 'TB185FR', 'TB285', 'TB285FR', 'TB290', 'TB80FR', 'CX75R', 'CX75SR', 'CX80', 'E80', 'E85', 'ECR85', 'EC88', 'DX80', 'DX80-R', 'DX85-R'],
      '450x86SDx60': ['TL12V2', 'TL12R2', '332VTS SYSTEM'],
      '450x86x52': ['864', '864FG', '864G', 'T200', 'T630', 'T650'],
      '450x86x55': ['445CT', '450CT', 'TR320', 'TR340', 'TV370', 'TV380', 'T250', 'T300', 'T320', 'T730', 'T740', 'T750', 'T760', 'T770'],
      '450x86x56': ['70XT', '75XT', '260T', '320T ECO', '329D', '329E', '333D', '333E', '333G', 'CT332', 'MC90', 'MC110', 'MC110B', 'MCT110C', 'MCT125C', 'MTC135C', 'MTC145C', '236', '236B', '246', '248', '248B', '279D', '289C-2', '289D', '279C2', '1020 TURBO', 'CK30-1', 'CK35-1', 'CK35'],
      '450x86x58': ['SVL90', 'SVL95', 'SVL95-2', '325 VTS SYST', '328 VTS SYST', 'T830', 'T870', '6635', '6640', 'RT250', 'RT255', 'VT320 SKID STEER VTS SYSTEMS', 'SK1020'],
      '450x86x60': ['873', '883', '246C', '256C', '262C', '268B', '279C', '289C', '299D', '299D2', '299D3', '299D XHP', '299D2 XHP', '299C']
    }
  };

  // Function to get track sizes for a model
  const getTrackSizeForModel = (model) => {
    // Find all track sizes this model belongs to (a model can have multiple track sizes)
    // Trim and normalize the model name for comparison
    if (!model) {
      console.warn(`[getTrackSizeForModel] No model provided`);
      return null;
    }
    
    const modelNormalized = String(model).trim().toLowerCase();
    
    // Access the track sizes map
    if (!trackSizeToModelsMap || !trackSizeToModelsMap['track-sizes']) {
      console.error(`[getTrackSizeForModel] trackSizeToModelsMap or 'track-sizes' is missing!`);
      console.error(`[getTrackSizeForModel] trackSizeToModelsMap:`, trackSizeToModelsMap);
      return null;
    }
    
    const trackSizesMap = trackSizeToModelsMap['track-sizes'];
    const foundTrackSizes = [];
    
    // Debug: Log the structure
    console.log(`[getTrackSizeForModel] Searching for model: "${model}" (normalized: "${modelNormalized}")`);
    console.log(`[getTrackSizeForModel] Track sizes map exists:`, !!trackSizesMap);
    console.log(`[getTrackSizeForModel] Track sizes map keys count:`, Object.keys(trackSizesMap).length);
    
    // Check if trackSizesMap is empty or invalid
    if (!trackSizesMap || Object.keys(trackSizesMap).length === 0) {
      console.error(`[getTrackSizeForModel] Track sizes map is empty!`);
      return null;
    }
    
    // Test lookup for a known model to verify structure
    const testTrackSize = '450x86x56';
    if (trackSizesMap[testTrackSize]) {
      const testModels = trackSizesMap[testTrackSize];
      console.log(`[getTrackSizeForModel] Test: Track size "${testTrackSize}" has models:`, testModels);
      const testFound = testModels.some(m => String(m).trim().toLowerCase() === '333d');
      console.log(`[getTrackSizeForModel] Test: "333d" found in test track size:`, testFound);
    } else {
      console.error(`[getTrackSizeForModel] Test track size "${testTrackSize}" not found in map!`);
    }
    
    for (const [trackSize, models] of Object.entries(trackSizesMap)) {
      // Ensure models is an array
      if (!Array.isArray(models)) {
        console.warn(`[getTrackSizeForModel] Track size "${trackSize}" has non-array models:`, models);
        continue;
      }
      
      // Check if this model is in the array
      const found = models.some(m => {
        const modelInArray = String(m).trim().toLowerCase();
        const matches = modelInArray === modelNormalized;
        if (matches) {
          console.log(`[getTrackSizeForModel] Found match: "${m}" (normalized: "${modelInArray}") matches "${modelNormalized}" for track size "${trackSize}"`);
        }
        return matches;
      });
      
      if (found) {
        foundTrackSizes.push(trackSize);
      }
    }
    
    // Debug logging
    if (foundTrackSizes.length === 0) {
      console.warn(`[getTrackSizeForModel] Model "${model}" not found in track size map. Searched for: "${modelNormalized}"`);
      // Try to find similar models for debugging
      const allModels = [];
      for (const [trackSize, models] of Object.entries(trackSizesMap)) {
        if (Array.isArray(models)) {
          allModels.push(...models);
        }
      }
      const similarModels = allModels.filter(m => {
        const mNormalized = String(m).trim().toLowerCase();
        return mNormalized.includes(modelNormalized) || 
               modelNormalized.includes(mNormalized);
      });
      if (similarModels.length > 0) {
        console.log(`[getTrackSizeForModel] Similar models found: ${similarModels.slice(0, 10).join(', ')}`);
      } else {
        // Show some sample models from the map
        const sampleModels = allModels.slice(0, 20);
        console.log(`[getTrackSizeForModel] Sample models in map: ${sampleModels.join(', ')}`);
      }
    } else {
      console.log(`[getTrackSizeForModel] Successfully found ${foundTrackSizes.length} track size(s): ${foundTrackSizes.join(', ')}`);
    }
    
    return foundTrackSizes.length > 0 ? foundTrackSizes : null; // Return array of track sizes or null if not found
  };

  const handleSearch = () => {
    // Reset error state
    setSearchError(null);
    
    // Filter products based on selected model and track size
    if (!selectedModel) {
      // If no model is selected, don't filter
      setFilteredProducts(null);
      setCurrentTrackSizes([]);
      return;
    }

    try {
      // Get all track sizes for the selected model (can be multiple)
      console.log(`[Search] Looking for model: "${selectedModel}"`);
      const trackSizes = getTrackSizeForModel(selectedModel);
      console.log(`[Search] Found track sizes:`, trackSizes);
      
      if (!trackSizes || trackSizes.length === 0) {
        // If no track size is found for this model, show error message
        setFilteredProducts([]);
        setCurrentTrackSizes([]);
        setSearchError(`No track size found for model "${selectedModel}". Please check the model name or contact support.`);
        console.warn(`[Search] No track size found for model: "${selectedModel}"`);
        return;
      }

      // Store the track sizes for display
      setCurrentTrackSizes(trackSizes);

      // Filter products that contain any of the track sizes in their description, title, or tags
      const filtered = products.filter(product => {
        const productTitle = (product.title || '').toLowerCase();
        const productDescription = (product.description || '').toLowerCase();
        const productTags = (product.tags || []).map(tag => tag.toLowerCase());
        
        // Check if any of the track sizes appear in the product's description, title, or tags
        return trackSizes.some(trackSize => {
          const trackSizeLower = trackSize.toLowerCase();
          return productDescription.includes(trackSizeLower) ||
                 productTitle.includes(trackSizeLower) ||
                 productTags.some(tag => tag.includes(trackSizeLower));
        });
      });
      
      if (filtered.length === 0) {
        setSearchError(`No products found matching track size(s): ${trackSizes.join(', ')}. Try a different model or check if products are available.`);
      }
      
      setFilteredProducts(filtered);
      console.log(`Search completed: Found ${filtered.length} products for model "${selectedModel}" with track size(s): ${trackSizes.join(', ')}`);
    } catch (error) {
      console.error('Error during search:', error);
      setSearchError('An error occurred during search. Please try again.');
      setFilteredProducts([]);
      setCurrentTrackSizes([]);
    }
  };

  const handleShowAll = () => {
    setFilteredProducts(null); // Reset to show all products
    setCurrentTrackSizes([]); // Clear track size display
    setSearchError(null); // Clear any error messages
    setSelectedMake('');
    setSelectedModel('');
  };

  // Use filtered products if search was performed, otherwise show all products
  const displayProducts = filteredProducts !== null ? filteredProducts : products;

  if (loading) {
    return (
      <div className="products-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page">
        <div className="error-container">
          <h2>Error Loading Products</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </div>
          
          {isMenuOpen && (
            <>
              <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}></div>
              <div className="dropdown-menu">
                <button className="sidebar-close" onClick={() => setIsMenuOpen(false)}>×</button>
                <Link to="/products" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>Products</Link>
                <Link to="/about" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>About</Link>
                <Link to="/faq" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>FAQ</Link>
              </div>
            </>
          )}
          
          <Link to="/" style={{ textDecoration: 'none' }}>
            <img src="/Logo2.png" alt="Trailer Safe USA" className="logo-image" />
            {/* OLD LOGO - COMMENTED OUT FOR FUTURE USE
            <div className="logo">
              <span className="logo-text">Trailer</span>
              <span className="logo-text-bold">Safe</span>
              <span className="logo-underline"></span>
              <span className="logo-text-small">USA</span>
            </div>
            */}
          </Link>
          
          <Link to="/cart" className="cart-icon-link">
            <div className="cart-icon">
              <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H16.55C17.3 13 17.96 12.59 18.3 11.97L21.88 5.48C21.96 5.34 22 5.17 22 5C22 4.45 21.55 4 21 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" fill="white"/>
              </svg>
              {getCartItemCount() > 0 && (
                <span className="cart-badge">{getCartItemCount()}</span>
              )}
            </div>
          </Link>
          
          {/* NAVIGATION LINKS - REMOVED
          <nav className="header-nav">
            <a href="/products" className="nav-link">Products</a>
            <a href="#about" className="nav-link">About Us</a>
            <a href="#faq" className="nav-link">FAQ</a>
          </nav>
          */}
        </div>
      </header>

      {/* Main Content Container */}
      <div className="products-main-container">
        {/* Title Section */}
        <div className="products-title-section">
          <h1 className="products-main-title">Products</h1>
          <div className="products-title-line"></div>
        </div>

        {/* Dropdown Bar */}
        <div className="products-dropdown-bar">
          <select 
            className="dropdown-select" 
            value={selectedMake}
            onChange={handleMakeChange}
          >
            <option value="">MAKE</option>
            <option value="bobcat">Bobcat</option>
            <option value="case">Case</option>
            <option value="caterpillar">Caterpillar</option>
            <option value="ditch-witch">Ditch Witch</option>
            <option value="doosan">Doosan</option>
            <option value="gehl">Gehl</option>
            <option value="hitachi">Hitachi</option>
            <option value="jcb">JCB</option>
            <option value="john-deere">John Deere</option>
            <option value="kobelco">Kobelco</option>
            <option value="komatsu">Komatsu</option>
            <option value="kubota">Kubota</option>
            <option value="takeuchi">Takeuchi</option>
            <option value="terex">Terex</option>
            <option value="volvo">Volvo</option>
          </select>
          <select 
            key={selectedMake || 'no-make'}
            className="dropdown-select" 
            value={selectedModel}
            onChange={handleModelChange}
            disabled={!selectedMake}
          >
            <option value="">MODEL</option>
            {getModelOptions().map((model) => (
              <option key={model} value={model.toLowerCase()}>
                {model}
              </option>
            ))}
          </select>
          <button 
            className="search-button" 
            onClick={handleSearch}
            disabled={!selectedModel}
          >
            SEARCH
          </button>
          <button 
            className="show-all-button" 
            onClick={handleShowAll}
          >
            SHOW ALL
          </button>
        </div>

        {/* Track Size Display */}
        {currentTrackSizes.length > 0 && (
          <div className="track-size-display">
            <p className="track-size-text">
              <span className="track-size-label">
                {currentTrackSizes.length === 1 ? 'Track Size: ' : 'Track Sizes: '}
              </span>
              <span className="track-size-value">
                {currentTrackSizes.join(', ')}
              </span>
            </p>
          </div>
        )}

        {/* Error Message Display */}
        {searchError && (
          <div className="search-error-display">
            <p className="error-text">{searchError}</p>
          </div>
        )}

        {/* Products Grid */}
        <div className="products-grid-container">
          <div className="products-grid">
            {displayProducts.map((product) => (
              <div 
                key={product.id} 
                className="product-card"
                onClick={() => handleProductClick(product)}
              >
                <div className="product-image-wrapper">
                  <img src={product.image} alt={product.title} className="product-image" />
                </div>
                <div className="product-details">
                  <h3 className="product-name">{product.title}</h3>
                  <p className="product-price">{product.price.includes('USD') ? product.price : `${product.price} USD`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="product-modal-overlay" onClick={handleCloseModal}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>×</button>
            
            <div className="modal-content">
              <div className="modal-image">
                <img src={selectedProduct.image} alt={selectedProduct.title} />
              </div>
              
              <div className="modal-details">
                <h2 className="modal-title">{selectedProduct.title}</h2>
                <p className="modal-price">{selectedProduct.price.includes('USD') ? selectedProduct.price : `${selectedProduct.price} USD`}</p>
                
                {selectedProduct.description && (
                  <p className="modal-description">{selectedProduct.description}</p>
                )}
                
                <div className="modal-quantity">
                  <label htmlFor="quantity">Quantity:</label>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="quantity-input"
                  />
                </div>
                
                <div className="modal-actions">
                  <button className="btn-add-to-cart" onClick={handleAddToCart}>
                    Add to Cart
                  </button>
                  <button className="btn-buy-now" onClick={handleBuyNow}>
                    Buy it Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default ProductsPage;
