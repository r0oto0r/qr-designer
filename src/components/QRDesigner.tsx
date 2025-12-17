import React, { useState, useEffect, useRef } from 'react';
import QRCodeStyling, { Options } from 'qr-code-styling';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Slider } from './ui/slider';

type DotsType = 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
type CornerSquareType = 'dot' | 'square' | 'extra-rounded' | 'rounded' | 'dots' | 'classy' | 'classy-rounded';
type CornerDotType = 'dot' | 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'extra-rounded';
type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';
type GradientType = 'linear' | 'radial';
type ShapeType = 'square' | 'circle';
type DataType = 'text' | 'wifi';

const QRDesigner: React.FC = () => {
	const [dataType, setDataType] = useState<DataType>('text');
	const [textData, setTextData] = useState<string>('https://qr-code-styling.com');
	const [wifiSsid, setWifiSsid] = useState<string>('');
	const [wifiPassword, setWifiPassword] = useState<string>('');
	const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
	const [wifiHidden, setWifiHidden] = useState<boolean>(false);
	const [imageFile, setImageFile] = useState<string>('');
	const [options, setOptions] = useState<Options>({
		width: 300,
		height: 300,
		type: 'svg',
		shape: 'square',
		data: 'https://qr-code-styling.com',
		image: '',
		margin: 0,
		qrOptions: {
			errorCorrectionLevel: 'Q',
		},
		imageOptions: {
			hideBackgroundDots: true,
			imageSize: 0.4,
			margin: 0,
		},
		dotsOptions: {
			color: '#000000',
			type: 'square',
			roundSize: true,
		},
		backgroundOptions: {
			color: '#ffffff',
		},
		cornersSquareOptions: {
			color: '#000000',
			type: 'square',
		},
		cornersDotOptions: {
			color: '#000000',
			type: 'square',
		},
	});

	const [useDotsGradient, setUseDotsGradient] = useState(false);
	const [useBackgroundGradient, setUseBackgroundGradient] = useState(false);
	const [useCornersSquareGradient, setUseCornersSquareGradient] = useState(false);
	const [useCornersDotGradient, setUseCornersDotGradient] = useState(false);

	const [expandedSections, setExpandedSections] = useState({
		main: true,
		dots: false,
		cornersSquare: false,
		cornersDot: false,
		background: false,
		image: false,
		qr: false,
	});

	const qrCodeRef = useRef<QRCodeStyling | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const toggleSection = (section: keyof typeof expandedSections) => {
		setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
	};

	useEffect(() => {
		if (!qrCodeRef.current) {
			qrCodeRef.current = new QRCodeStyling(options);
			if (containerRef.current) {
				qrCodeRef.current.append(containerRef.current);
			}
		}
	}, [options]);

	useEffect(() => {
		if (qrCodeRef.current) {
			qrCodeRef.current.update(options);
		}
	}, [options]);

	useEffect(() => {
		let qrData = '';
		if (dataType === 'text') {
			qrData = textData;
		} else if (dataType === 'wifi') {
			qrData = `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};H:${wifiHidden};`;
		}
		updateOption('data', qrData);
	}, [dataType, textData, wifiSsid, wifiPassword, wifiEncryption, wifiHidden]);

	const updateOption = <K extends keyof Options>(key: K, value: Options[K]) => {
		setOptions((prev: Options) => ({ ...prev, [key]: value }));
	};

	const updateNestedOption = <T extends keyof Options>(
		parent: T,
		key: string,
		value: unknown
	) => {
		setOptions((prev: Options) => ({
			...prev,
			[parent]: {
				...(prev[parent] as Record<string, unknown>),
				[key]: value,
			},
		}));
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				const result = event.target?.result as string;
				setImageFile(result);
				updateOption('image', result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleDownload = async (extension: 'png' | 'jpeg' | 'webp' | 'svg') => {
		if (qrCodeRef.current) {
			qrCodeRef.current.update(options);
			await new Promise(resolve => setTimeout(resolve, 100));
			await qrCodeRef.current.download({ name: 'qr', extension });
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">QR Code Designer</h1>
					<p className="text-slate-600 dark:text-slate-400">Create custom styled QR codes with advanced design options</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)] pr-2">
						<Card className="border-2 border-blue-500/40 dark:border-blue-400/40 bg-blue-50/30 dark:bg-blue-950/20 shadow-lg">
							<CardHeader 
								className="cursor-pointer hover:bg-blue-100/50 dark:hover:bg-blue-900/30 transition-colors select-none"
								onClick={() => toggleSection('main')}
							>
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<CardTitle className="text-lg flex items-center gap-2">
											<span className="text-2xl">📝</span>
											<span>Main Options</span>
										</CardTitle>
										<CardDescription className="text-xs mt-1">Data, size, and basic settings</CardDescription>
									</div>
									<div className="text-2xl font-bold text-slate-400">{expandedSections.main ? '−' : '+'}</div>
								</div>
							</CardHeader>
							{expandedSections.main && (
								<CardContent className="space-y-4 pt-4 border-t animate-in slide-in-from-top-2">
									<div className="space-y-2">
										<Label htmlFor="dataType" className="font-semibold text-sm">Data Type *</Label>
										<select
											id="dataType"
											className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
											value={dataType}
											onChange={(e) => setDataType(e.target.value as DataType)}
										>
											<option value="text">URL / Text</option>
											<option value="wifi">WiFi</option>
										</select>
									</div>
									{dataType === 'text' && (
										<div className="space-y-2">
											<Label htmlFor="textData" className="font-semibold text-sm">Data / URL *</Label>
											<Input
												id="textData"
												type="text"
												value={textData}
												onChange={(e) => setTextData(e.target.value)}
												placeholder="https://example.com"
												className="font-mono text-sm"
											/>
										</div>
									)}							
									{dataType === 'wifi' && (
										<div className="space-y-4 bg-blue-50/50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
											<div className="space-y-2">
												<Label htmlFor="wifiSsid" className="font-semibold text-sm">WiFi SSID *</Label>
												<Input
													id="wifiSsid"
													type="text"
													value={wifiSsid}
													onChange={(e) => setWifiSsid(e.target.value)}
													placeholder="My Network"
													className="font-mono text-sm"
												/>
											</div>									<div className="space-y-2">
												<Label htmlFor="wifiPassword" className="font-semibold text-sm">Password *</Label>
												<Input
													id="wifiPassword"
													type="text"
													value={wifiPassword}
													onChange={(e) => setWifiPassword(e.target.value)}
													placeholder="WiFi password"
													className="font-mono text-sm"
												/>
											</div>									<div className="space-y-2">
												<Label htmlFor="wifiEncryption" className="font-semibold text-sm">Encryption Type</Label>
												<select
													id="wifiEncryption"
													className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
													value={wifiEncryption}
													onChange={(e) => setWifiEncryption(e.target.value as 'WPA' | 'WEP' | 'nopass')}
												>
													<option value="WPA">WPA/WPA2/WPA3</option>
													<option value="WEP">WEP</option>
													<option value="nopass">No Password</option>
												</select>
											</div>									<div className="flex items-center space-x-2">
												<input
													type="checkbox"
													id="wifiHidden"
													className="h-4 w-4 rounded border-gray-300"
													checked={wifiHidden}
													onChange={(e) => setWifiHidden(e.target.checked)}
												/>
												<Label htmlFor="wifiHidden" className="text-sm cursor-pointer">Hidden Network</Label>
											</div>
										</div>
									)}									
									<div className="space-y-2">
										<Label htmlFor="image" className="font-semibold text-sm">Logo Image Upload</Label>
										<Input
											id="image"
											type="file"
											accept="image/*"
											onChange={handleImageUpload}
											className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200 dark:hover:file:bg-blue-800"
										/>
										{imageFile && (
											<div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
												<span>✓ Image loaded</span>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => {
														setImageFile('');
														updateOption('image', '');
													}}
													className="h-6 px-2 text-xs"
												>
													Remove
												</Button>
											</div>
										)}
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="width" className="font-semibold text-sm">Width</Label>
											<Input
												id="width"
												type="number"
												value={options.width}
												onChange={(e) => updateOption('width', Number(e.target.value))}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="height" className="font-semibold text-sm">Height</Label>
											<Input
												id="height"
												type="number"
												value={options.height}
												onChange={(e) => updateOption('height', Number(e.target.value))}
											/>
										</div>
									</div>

									<div className="space-y-2 bg-slate-50 p-3 rounded-lg">
										<div className="flex items-center justify-between">
											<Label htmlFor="margin" className="font-semibold text-sm">Margin</Label>
											<span className="text-sm font-mono bg-white px-3 py-1 rounded border">{options.margin}px</span>
										</div>
										<Slider
											id="margin"
											min={0}
											max={50}
											step={1}
											value={[options.margin || 0]}
											onValueChange={(value) => updateOption('margin', value[0])}
											className="mt-2"
										/>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="type" className="font-semibold text-sm">Output Type</Label>
											<select
												id="type"
												className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
												value={options.type}
												onChange={(e) => updateOption('type', e.target.value as 'canvas' | 'svg')}
											>
												<option value="canvas">Canvas</option>
												<option value="svg">SVG</option>
											</select>
										</div>
										<div className="space-y-2">
											<Label htmlFor="shape" className="font-semibold text-sm">QR Shape</Label>
											<select
												id="shape"
												className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
												value={options.shape}
												onChange={(e) => updateOption('shape', e.target.value as ShapeType)}
											>
												<option value="square">Square</option>
												<option value="circle">Circle</option>
											</select>
										</div>
									</div>
								</CardContent>
							)}
						</Card>

						<Card className="border-2 border-purple-500/40 dark:border-purple-400/40 bg-purple-50/30 dark:bg-purple-950/20 hover:border-purple-500/60 dark:hover:border-purple-400/60 transition-colors">
							<CardHeader 
								className="cursor-pointer hover:bg-purple-100/50 dark:hover:bg-purple-900/30 transition-colors select-none"
								onClick={() => toggleSection('dots')}
							>
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<CardTitle className="text-lg flex items-center gap-2">
											<span className="text-2xl">⬛</span>
											<span>Dots Style</span>
										</CardTitle>
										<CardDescription className="text-xs mt-1 font-mono">
											{options.dotsOptions?.type} • {useDotsGradient ? 'Gradient' : options.dotsOptions?.color}
										</CardDescription>
									</div>
									<div className="text-2xl font-bold text-slate-400">{expandedSections.dots ? '−' : '+'}</div>
								</div>
							</CardHeader>
							{expandedSections.dots && (
								<CardContent className="space-y-4 pt-4 border-t animate-in slide-in-from-top-2">
									<div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-lg">
										<input
											type="checkbox"
											id="useDotsGradient"
											className="h-4 w-4 rounded border-gray-300"
											checked={useDotsGradient}
											onChange={(e) => {
												setUseDotsGradient(e.target.checked);
												if (e.target.checked) {
													updateNestedOption('dotsOptions', 'gradient', {
														type: 'linear',
														rotation: 0,
														colorStops: [
															{ offset: 0, color: '#000000' },
															{ offset: 1, color: '#ffffff' },
														],
													});
													updateNestedOption('dotsOptions', 'color', undefined);
												} else {
													updateNestedOption('dotsOptions', 'gradient', undefined);
													updateNestedOption('dotsOptions', 'color', '#000000');
												}
											}}
										/>
										<Label htmlFor="useDotsGradient" className="cursor-pointer font-semibold">Use Gradient</Label>
									</div>

									{!useDotsGradient ? (
										<div className="space-y-2">
											<Label htmlFor="dotsColor" className="font-semibold text-sm">Color</Label>
											<div className="flex gap-2">
												<Input
													id="dotsColor"
													type="color"
													value={options.dotsOptions?.color || '#000000'}
													onChange={(e) => updateNestedOption('dotsOptions', 'color', e.target.value)}
													className="w-20 h-10 cursor-pointer"
												/>
												<Input
													type="text"
													value={options.dotsOptions?.color || '#000000'}
													onChange={(e) => updateNestedOption('dotsOptions', 'color', e.target.value)}
													className="flex-1 font-mono"
												/>
											</div>
										</div>
									) : (
										<div className="space-y-4">
											<div className="space-y-2">
												<Label htmlFor="dotsGradientType" className="font-semibold text-sm">Gradient Type</Label>
												<select
													id="dotsGradientType"
													className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
													value={options.dotsOptions?.gradient?.type || 'linear'}
													onChange={(e) => {
														const gradient = options.dotsOptions?.gradient || { type: 'linear', colorStops: [] };
														updateNestedOption('dotsOptions', 'gradient', {
															...gradient,
															type: e.target.value as GradientType,
														});
													}}
												>
													<option value="linear">Linear</option>
													<option value="radial">Radial</option>
												</select>
											</div>
											<div className="space-y-2 bg-slate-50 p-3 rounded-lg">
												<div className="flex items-center justify-between">
													<Label htmlFor="dotsGradientRotation" className="font-semibold text-sm">Rotation</Label>
													<span className="text-sm font-mono bg-white px-3 py-1 rounded border">{options.dotsOptions?.gradient?.rotation || 0}°</span>
												</div>
												<Slider
													id="dotsGradientRotation"
													min={0}
													max={360}
													step={15}
													value={[options.dotsOptions?.gradient?.rotation || 0]}
													onValueChange={(value) => {
														const gradient = options.dotsOptions?.gradient || { type: 'linear', colorStops: [] };
														updateNestedOption('dotsOptions', 'gradient', {
															...gradient,
															rotation: value[0],
														});
													}}
												/>
											</div>
										</div>
									)}

									<div className="space-y-2">
										<Label htmlFor="dotsType" className="font-semibold text-sm">Dots Style</Label>
										<select
											id="dotsType"
											className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
											value={options.dotsOptions?.type || 'square'}
											onChange={(e) => updateNestedOption('dotsOptions', 'type', e.target.value as DotsType)}
										>
											<option value="square">■ Square</option>
											<option value="rounded">● Rounded</option>
											<option value="dots">⚫ Dots</option>
											<option value="classy">◆ Classy</option>
											<option value="classy-rounded">◈ Classy Rounded</option>
											<option value="extra-rounded">⬤ Extra Rounded</option>
										</select>
									</div>

									<div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-lg">
										<input
											type="checkbox"
											id="roundSize"
											className="h-4 w-4 rounded border-gray-300"
											checked={options.dotsOptions?.roundSize ?? true}
											onChange={(e) => updateNestedOption('dotsOptions', 'roundSize', e.target.checked)}
										/>
										<Label htmlFor="roundSize" className="cursor-pointer font-semibold">Round Size to Integer</Label>
									</div>
								</CardContent>
							)}
						</Card>

						<Card className="border-2 border-orange-500/40 dark:border-orange-400/40 bg-orange-50/30 dark:bg-orange-950/20 hover:border-orange-500/60 dark:hover:border-orange-400/60 transition-colors">
							<CardHeader 
								className="cursor-pointer hover:bg-orange-100/50 dark:hover:bg-orange-900/30 transition-colors select-none"
								onClick={() => toggleSection('cornersSquare')}
							>
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<CardTitle className="text-lg flex items-center gap-2">
											<span className="text-2xl">⬜</span>
											<span>Corner Squares</span>
										</CardTitle>
										<CardDescription className="text-xs mt-1 font-mono">
											{options.cornersSquareOptions?.type} • {useCornersSquareGradient ? 'Gradient' : options.cornersSquareOptions?.color}
										</CardDescription>
									</div>
									<div className="text-2xl font-bold text-slate-400">{expandedSections.cornersSquare ? '−' : '+'}</div>
								</div>
							</CardHeader>
							{expandedSections.cornersSquare && (
								<CardContent className="space-y-4 pt-4 border-t animate-in slide-in-from-top-2">
									<div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-lg">
										<input
											type="checkbox"
											id="useCornersSquareGradient"
											className="h-4 w-4 rounded border-gray-300"
											checked={useCornersSquareGradient}
											onChange={(e) => {
												setUseCornersSquareGradient(e.target.checked);
												if (e.target.checked) {
													updateNestedOption('cornersSquareOptions', 'gradient', {
														type: 'linear',
														rotation: 0,
														colorStops: [
															{ offset: 0, color: '#000000' },
															{ offset: 1, color: '#ffffff' },
														],
													});
													updateNestedOption('cornersSquareOptions', 'color', undefined);
												} else {
													updateNestedOption('cornersSquareOptions', 'gradient', undefined);
													updateNestedOption('cornersSquareOptions', 'color', '#000000');
												}
											}}
										/>
										<Label htmlFor="useCornersSquareGradient" className="cursor-pointer font-semibold">Use Gradient</Label>
									</div>

									{!useCornersSquareGradient && (
										<div className="space-y-2">
											<Label htmlFor="cornersSquareColor" className="font-semibold text-sm">Color</Label>
											<div className="flex gap-2">
												<Input
													id="cornersSquareColor"
													type="color"
													value={options.cornersSquareOptions?.color || '#000000'}
													onChange={(e) => updateNestedOption('cornersSquareOptions', 'color', e.target.value)}
													className="w-20 h-10 cursor-pointer"
												/>
												<Input
													type="text"
													value={options.cornersSquareOptions?.color || '#000000'}
													onChange={(e) => updateNestedOption('cornersSquareOptions', 'color', e.target.value)}
													className="flex-1 font-mono"
												/>
											</div>
										</div>
									)}

									<div className="space-y-2">
										<Label htmlFor="cornersSquareType" className="font-semibold text-sm">Corner Square Style</Label>
										<select
											id="cornersSquareType"
											className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
											value={options.cornersSquareOptions?.type || 'square'}
											onChange={(e) => updateNestedOption('cornersSquareOptions', 'type', e.target.value as CornerSquareType)}
										>
											<option value="square">■ Square</option>
											<option value="dot">● Dot</option>
											<option value="rounded">● Rounded</option>
											<option value="extra-rounded">⬤ Extra Rounded</option>
											<option value="dots">⚫ Dots</option>
											<option value="classy">◆ Classy</option>
											<option value="classy-rounded">◈ Classy Rounded</option>
										</select>
									</div>
								</CardContent>
							)}
						</Card>

						<Card className="border-2 border-red-500/40 dark:border-red-400/40 bg-red-50/30 dark:bg-red-950/20 hover:border-red-500/60 dark:hover:border-red-400/60 transition-colors">
							<CardHeader 
								className="cursor-pointer hover:bg-red-100/50 dark:hover:bg-red-900/30 transition-colors select-none"
								onClick={() => toggleSection('cornersDot')}
							>
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<CardTitle className="text-lg flex items-center gap-2">
											<span className="text-2xl">⚫</span>
											<span>Corner Dots</span>
										</CardTitle>
										<CardDescription className="text-xs mt-1 font-mono">
											{options.cornersDotOptions?.type} • {useCornersDotGradient ? 'Gradient' : options.cornersDotOptions?.color}
										</CardDescription>
									</div>
									<div className="text-2xl font-bold text-slate-400">{expandedSections.cornersDot ? '−' : '+'}</div>
								</div>
							</CardHeader>
							{expandedSections.cornersDot && (
								<CardContent className="space-y-4 pt-4 border-t animate-in slide-in-from-top-2">
									<div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-lg">
										<input
											type="checkbox"
											id="useCornersDotGradient"
											className="h-4 w-4 rounded border-gray-300"
											checked={useCornersDotGradient}
											onChange={(e) => {
												setUseCornersDotGradient(e.target.checked);
												if (e.target.checked) {
													updateNestedOption('cornersDotOptions', 'gradient', {
														type: 'linear',
														rotation: 0,
														colorStops: [
															{ offset: 0, color: '#000000' },
															{ offset: 1, color: '#ffffff' },
														],
													});
													updateNestedOption('cornersDotOptions', 'color', undefined);
												} else {
													updateNestedOption('cornersDotOptions', 'gradient', undefined);
													updateNestedOption('cornersDotOptions', 'color', '#000000');
												}
											}}
										/>
										<Label htmlFor="useCornersDotGradient" className="cursor-pointer font-semibold">Use Gradient</Label>
									</div>

									{!useCornersDotGradient && (
										<div className="space-y-2">
											<Label htmlFor="cornersDotColor" className="font-semibold text-sm">Color</Label>
											<div className="flex gap-2">
												<Input
													id="cornersDotColor"
													type="color"
													value={options.cornersDotOptions?.color || '#000000'}
													onChange={(e) => updateNestedOption('cornersDotOptions', 'color', e.target.value)}
													className="w-20 h-10 cursor-pointer"
												/>
												<Input
													type="text"
													value={options.cornersDotOptions?.color || '#000000'}
													onChange={(e) => updateNestedOption('cornersDotOptions', 'color', e.target.value)}
													className="flex-1 font-mono"
												/>
											</div>
										</div>
									)}

									<div className="space-y-2">
										<Label htmlFor="cornersDotType" className="font-semibold text-sm">Corner Dot Style</Label>
										<select
											id="cornersDotType"
											className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
											value={options.cornersDotOptions?.type || 'square'}
											onChange={(e) => updateNestedOption('cornersDotOptions', 'type', e.target.value as CornerDotType)}
										>
											<option value="square">■ Square</option>
											<option value="dot">● Dot</option>
											<option value="rounded">● Rounded</option>
											<option value="extra-rounded">⬤ Extra Rounded</option>
											<option value="dots">⚫ Dots</option>
											<option value="classy">◆ Classy</option>
											<option value="classy-rounded">◈ Classy Rounded</option>
										</select>
									</div>
								</CardContent>
							)}
						</Card>

						<Card className="border-2 border-green-500/40 dark:border-green-400/40 bg-green-50/30 dark:bg-green-950/20 hover:border-green-500/60 dark:hover:border-green-400/60 transition-colors">
							<CardHeader 
								className="cursor-pointer hover:bg-green-100/50 dark:hover:bg-green-900/30 transition-colors select-none"
								onClick={() => toggleSection('background')}
							>
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<CardTitle className="text-lg flex items-center gap-2">
											<span className="text-2xl">🎨</span>
											<span>Background</span>
										</CardTitle>
										<CardDescription className="text-xs mt-1 font-mono">
											{useBackgroundGradient ? 'Gradient' : options.backgroundOptions?.color}
										</CardDescription>
									</div>
									<div className="text-2xl font-bold text-slate-400">{expandedSections.background ? '−' : '+'}</div>
								</div>
							</CardHeader>
							{expandedSections.background && (
								<CardContent className="space-y-4 pt-4 border-t animate-in slide-in-from-top-2">
									<div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-lg">
										<input
											type="checkbox"
											id="useBackgroundGradient"
											className="h-4 w-4 rounded border-gray-300"
											checked={useBackgroundGradient}
											onChange={(e) => {
												setUseBackgroundGradient(e.target.checked);
												if (e.target.checked) {
													updateNestedOption('backgroundOptions', 'gradient', {
														type: 'linear',
														rotation: 0,
														colorStops: [
															{ offset: 0, color: '#ffffff' },
															{ offset: 1, color: '#e9ebee' },
														],
													});
													updateNestedOption('backgroundOptions', 'color', undefined);
												} else {
													updateNestedOption('backgroundOptions', 'gradient', undefined);
													updateNestedOption('backgroundOptions', 'color', '#ffffff');
												}
											}}
										/>
										<Label htmlFor="useBackgroundGradient" className="cursor-pointer font-semibold">Use Gradient</Label>
									</div>

									{!useBackgroundGradient && (
										<div className="space-y-2">
											<Label htmlFor="backgroundColor" className="font-semibold text-sm">Color</Label>
											<div className="flex gap-2">
												<Input
													id="backgroundColor"
													type="color"
													value={options.backgroundOptions?.color || '#ffffff'}
													onChange={(e) => updateNestedOption('backgroundOptions', 'color', e.target.value)}
													className="w-20 h-10 cursor-pointer"
												/>
												<Input
													type="text"
													value={options.backgroundOptions?.color || '#ffffff'}
													onChange={(e) => updateNestedOption('backgroundOptions', 'color', e.target.value)}
													className="flex-1 font-mono"
												/>
											</div>
										</div>
									)}
								</CardContent>
							)}
						</Card>

						<Card className="border-2 border-pink-500/40 dark:border-pink-400/40 bg-pink-50/30 dark:bg-pink-950/20 hover:border-pink-500/60 dark:hover:border-pink-400/60 transition-colors">
							<CardHeader 
								className="cursor-pointer hover:bg-pink-100/50 dark:hover:bg-pink-900/30 transition-colors select-none"
								onClick={() => toggleSection('image')}
							>
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<CardTitle className="text-lg flex items-center gap-2">
											<span className="text-2xl">🖼️</span>
											<span>Logo Settings</span>
										</CardTitle>
										<CardDescription className="text-xs mt-1">
											Size: {((options.imageOptions?.imageSize ?? 0.4) * 100).toFixed(0)}% • Margin: {options.imageOptions?.margin ?? 0}px
										</CardDescription>
									</div>
									<div className="text-2xl font-bold text-slate-400">{expandedSections.image ? '−' : '+'}</div>
								</div>
							</CardHeader>
							{expandedSections.image && (
								<CardContent className="space-y-4 pt-4 border-t animate-in slide-in-from-top-2">
									<div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-lg">
										<input
											type="checkbox"
											id="hideBackgroundDots"
											className="h-4 w-4 rounded border-gray-300"
											checked={options.imageOptions?.hideBackgroundDots ?? true}
											onChange={(e) => updateNestedOption('imageOptions', 'hideBackgroundDots', e.target.checked)}
										/>
										<Label htmlFor="hideBackgroundDots" className="cursor-pointer font-semibold">Hide Dots Behind Logo</Label>
									</div>

									<div className="space-y-2 bg-slate-50 p-3 rounded-lg">
										<div className="flex items-center justify-between">
											<Label htmlFor="imageSize" className="font-semibold text-sm">Logo Size</Label>
											<span className="text-sm font-mono bg-white px-3 py-1 rounded border">{((options.imageOptions?.imageSize ?? 0.4) * 100).toFixed(0)}%</span>
										</div>
										<Slider
											id="imageSize"
											min={0}
											max={1}
											step={0.05}
											value={[options.imageOptions?.imageSize ?? 0.4]}
											onValueChange={(value) => updateNestedOption('imageOptions', 'imageSize', value[0])}
										/>
									</div>

									<div className="space-y-2 bg-slate-50 p-3 rounded-lg">
										<div className="flex items-center justify-between">
											<Label htmlFor="imageMargin" className="font-semibold text-sm">Logo Margin</Label>
											<span className="text-sm font-mono bg-white px-3 py-1 rounded border">{options.imageOptions?.margin ?? 0}px</span>
										</div>
										<Slider
											id="imageMargin"
											min={0}
											max={50}
											step={1}
											value={[options.imageOptions?.margin ?? 0]}
											onValueChange={(value) => updateNestedOption('imageOptions', 'margin', value[0])}
										/>
									</div>
								</CardContent>
							)}
						</Card>

						<Card className="border-2 border-teal-500/40 dark:border-teal-400/40 bg-teal-50/30 dark:bg-teal-950/20 hover:border-teal-500/60 dark:hover:border-teal-400/60 transition-colors">
							<CardHeader 
								className="cursor-pointer hover:bg-teal-100/50 dark:hover:bg-teal-900/30 transition-colors select-none"
								onClick={() => toggleSection('qr')}
							>
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<CardTitle className="text-lg flex items-center gap-2">
											<span className="text-2xl">🔧</span>
											<span>QR Options</span>
										</CardTitle>
										<CardDescription className="text-xs mt-1">
											Error Correction: {options.qrOptions?.errorCorrectionLevel || 'Q'}
										</CardDescription>
									</div>
									<div className="text-2xl font-bold text-slate-400">{expandedSections.qr ? '−' : '+'}</div>
								</div>
							</CardHeader>
							{expandedSections.qr && (
								<CardContent className="space-y-4 pt-4 border-t animate-in slide-in-from-top-2">
									<div className="space-y-2">
										<Label htmlFor="errorCorrection" className="font-semibold text-sm">Error Correction Level</Label>
										<select
											id="errorCorrection"
											className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
											value={options.qrOptions?.errorCorrectionLevel || 'Q'}
											onChange={(e) => updateNestedOption('qrOptions', 'errorCorrectionLevel', e.target.value as ErrorCorrectionLevel)}
										>
											<option value="L">L - Low (7% recovery)</option>
											<option value="M">M - Medium (15% recovery)</option>
											<option value="Q">Q - Quartile (25% recovery)</option>
											<option value="H">H - High (30% recovery)</option>
										</select>
										<p className="text-xs text-slate-500 mt-1">Higher levels allow QR code to remain readable even if partially damaged</p>
									</div>
								</CardContent>
							)}
						</Card>

						<Card className="border-2 border-emerald-500/40 dark:border-emerald-400/40 bg-emerald-50/50 dark:bg-emerald-950/30">
							<CardHeader>
								<CardTitle className="text-lg flex items-center gap-2">
									<span className="text-2xl">💾</span>
									<span>Export</span>
								</CardTitle>
								<CardDescription>Download your customized QR code</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 gap-3">
									<Button onClick={() => handleDownload('png')} variant="outline" className="h-12 font-semibold">
										📄 PNG
									</Button>
									<Button onClick={() => handleDownload('jpeg')} variant="outline" className="h-12 font-semibold">
										📷 JPEG
									</Button>
									<Button onClick={() => handleDownload('webp')} variant="outline" className="h-12 font-semibold">
										🌐 WEBP
									</Button>
									<Button onClick={() => handleDownload('svg')} variant="outline" className="h-12 font-semibold">
										🎨 SVG
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>

					<div className="lg:sticky lg:top-8 h-fit">
						<Card className="border-2 border-indigo-500/40 dark:border-indigo-400/40 bg-indigo-50/30 dark:bg-indigo-950/20">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<span className="text-2xl">👁️</span>
									<span>Preview</span>
								</CardTitle>
								<CardDescription>Your custom QR code updates in real-time</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-center min-h-[400px] bg-slate-50 dark:bg-slate-900 rounded-lg p-8 border-2 border-dashed border-slate-200 dark:border-slate-700">
									<div ref={containerRef} className="shadow-2xl" />
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default QRDesigner;
