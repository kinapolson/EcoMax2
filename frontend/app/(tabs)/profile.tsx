import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Switch, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';

const RECEIPTS_DATA = [
    {
        id: '1',
        storeName: 'Target',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Target_logo.svg/1200px-Target_logo.svg.png',
        points: 25,
        date: 'November 10, 2025',
        shortDate: '11.10.25',
        total: 25.68,
        items: [
            { code: '331009454', name: 'Wild Fable', price: 6.00, quantity: 1 },
            { code: '331007843', name: 'Wild Fable', price: 6.00, quantity: 1 },
            { code: '331007850', name: 'Wild Fable', price: 12.00, quantity: 2 },
        ],
    },
    {
        id: '2',
        storeName: 'Indeu Apothecary',
        logo: null,
        points: 25,
        date: 'November 10, 2025',
        shortDate: '11.10.25',
        total: 18.50,
        items: [
            { code: '100234', name: 'Herbal Tea', price: 8.50, quantity: 1 },
            { code: '100567', name: 'Essential Oil', price: 10.00, quantity: 1 },
        ],
    },
];

const FRIENDS_DATA = [
    {
        id: '1',
        name: 'Robert Williams',
        avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    },
    {
        id: '2',
        name: 'Crystal Park',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
        id: '3',
        name: 'Sam Stevenson',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    {
        id: '4',
        name: 'Jennifer Patterson',
        avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
    {
        id: '5',
        name: 'Chris Robinson',
        avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
    },
];

export default function ProfileScreen() {
    const [showFriends, setShowFriends] = useState(false);
    const [showAccountInfo, setShowAccountInfo] = useState(false);
    const router = useRouter();
    const [showHistory, setShowHistory] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState<typeof RECEIPTS_DATA[0] | null>(null);
    const [showReceiptImage, setShowReceiptImage] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSupport, setShowSupport] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [firstName, setFirstName] = useState('James');
    const [lastName, setLastName] = useState('Smith');
    const [email, setEmail] = useState('james.smith@gmail.com');
    const [password, setPassword] = useState('password123');

    if (showAccountInfo) {
        return (
            <View style={styles.accountContainer}>
                {/* Header with back button */}
                <ThemedView style={styles.accountHeader} lightColor="#264e36">
                    <TouchableOpacity
                        style={styles.accountBackButton}
                        onPress={() => setShowAccountInfo(false)}
                    >
                        <Ionicons name="chevron-back-outline" size={28} color="#f5f0e6" />
                    </TouchableOpacity>
                </ThemedView>

                <ScrollView style={styles.accountContent} showsVerticalScrollIndicator={false}>
                    {/* Account Information Card */}
                    <View style={styles.accountCardWrapper}>
                        <View style={styles.accountCard}>
                            <Ionicons name="lock-closed-outline" size={60} color="#f5f0e6" />
                            <ThemedText style={styles.accountCardTitle}>Account Information</ThemedText>
                        </View>
                    </View>

                    {/* Profile Picture */}
                    <View style={styles.accountAvatarWrapper}>
                        <View style={styles.accountAvatarOuter}>
                            <Image
                                source={require('../../assets/pfp/js_pfp.jpg')}
                                style={styles.accountAvatarImage}
                            />
                        </View>
                    </View>

                    {/* Form Fields */}
                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <ThemedText style={styles.inputLabel}>First Name</ThemedText>
                            <TextInput
                                style={styles.textInput}
                                value={firstName}
                                onChangeText={setFirstName}
                                placeholder="First Name"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <ThemedText style={styles.inputLabel}>Last Name</ThemedText>
                            <TextInput
                                style={styles.textInput}
                                value={lastName}
                                onChangeText={setLastName}
                                placeholder="Last Name"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <ThemedText style={styles.inputLabel}>Email</ThemedText>
                            <TextInput
                                style={styles.textInput}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Email"
                                placeholderTextColor="#999"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <ThemedText style={styles.inputLabel}>Password</ThemedText>
                            <TextInput
                                style={styles.textInput}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Password"
                                placeholderTextColor="#999"
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity style={styles.saveButton}>
                            <ThemedText style={styles.saveButtonText}>Save Changes</ThemedText>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }

    if (showReceiptImage && selectedReceipt) {
        return (
            <View style={styles.receiptImageContainer}>
                {/* Header with back button */}
                <View style={styles.receiptImageHeader}>
                    <TouchableOpacity
                        style={styles.receiptImageBackButton}
                        onPress={() => setShowReceiptImage(false)}
                    >
                        <Ionicons name="chevron-back-outline" size={28} color="#f5f0e6" />
                    </TouchableOpacity>
                </View>

                {/* Receipt image - only show for Target */}
                <View style={styles.receiptImageContent}>
                    {selectedReceipt.storeName === 'Target' && (
                        <Image
                            source={require('../../assets/images/target_receipt.jpeg')}
                            style={styles.receiptImage}
                            resizeMode="contain"
                        />
                    )}
                </View>
            </View>
        );
    }

    if (selectedReceipt) {
        return (
            <View style={styles.receiptDetailContainer}>
                {/* Header */}
                <View style={styles.receiptDetailHeader}>
                    <TouchableOpacity
                        style={styles.receiptDetailBackButton}
                        onPress={() => setSelectedReceipt(null)}
                    >
                        <Ionicons name="chevron-back-outline" size={28} color="#f5f0e6" />
                    </TouchableOpacity>

                    <View style={{ flex: 1 }} />

                    <TouchableOpacity
                        style={styles.receiptDetailMenuButton}
                        onPress={() => setShowReceiptImage(true)}
                    >
                        <Ionicons name="reader-outline" size={24} color="#f5f0e6" />
                    </TouchableOpacity>
                </View>

                {/* Receipt card */}
                <View style={styles.receiptDetailContent}>
                    <View style={styles.receiptDetailCard}>
                        {/* Store logo */}
                        <View style={styles.receiptDetailLogoContainer}>
                            <View style={styles.blankLogo} />
                        </View>

                        {/* Store name and date */}
                        <ThemedText style={styles.receiptDetailStoreName}>
                            {selectedReceipt.storeName}
                        </ThemedText>
                        <ThemedText style={styles.receiptDetailDate}>
                            {selectedReceipt.shortDate}
                        </ThemedText>

                        {/* Dashed divider */}
                        <View style={styles.receiptDashedLine} />

                        {/* Line items */}
                        <View style={styles.receiptItemsContainer}>
                            {selectedReceipt.items.map((item, index) => (
                                <View key={index} style={styles.receiptItemRow}>
                                    <ThemedText style={styles.receiptItemText}>
                                        {item.code} {item.name}{item.quantity > 1 ? ` x${item.quantity}` : ''}
                                    </ThemedText>
                                    <ThemedText style={styles.receiptItemPrice}>
                                        ${item.price.toFixed(2)}
                                    </ThemedText>
                                </View>
                            ))}
                        </View>

                        {/* Dashed divider */}
                        <View style={styles.receiptDashedLine} />

                        {/* Spacer */}
                        <View style={{ height: 120 }} />

                        {/* Total divider */}
                        <View style={styles.receiptDashedLine} />

                        {/* Total */}
                        <View style={styles.receiptTotalRow}>
                            <ThemedText style={styles.receiptTotalLabel}>Total</ThemedText>
                            <ThemedText style={styles.receiptTotalValue}>
                                ${selectedReceipt.total.toFixed(2)}
                            </ThemedText>
                        </View>

                        {/* Dashed divider */}
                        <View style={styles.receiptDashedLine} />

                        {/* Points earned */}
                        <View style={styles.receiptPointsEarned}>
                            <Ionicons name="leaf-outline" size={28} color="#264e36" />
                            <ThemedText style={styles.receiptPointsEarnedText}>
                                {selectedReceipt.points}
                            </ThemedText>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    if (showHistory) {
        return (
            <View style={styles.historyContainer}>
                {/* Header */}
                <ThemedView style={styles.historyHeader} lightColor="#264e36" />


                {/* Content area */}
                <View style={styles.historyContent}>
                    {/* Title row with back button */}
                    <View style={styles.historyTitleRow}>
                        <TouchableOpacity
                            style={styles.historyBackButton}
                            onPress={() => setShowHistory(false)}
                        >
                            <Ionicons name="chevron-back-outline" size={28} color="#264e36" />
                        </TouchableOpacity>

                        <ThemedText style={styles.historyTitle}>My Receipts</ThemedText>

                        <View style={{ width: 28 }} />
                    </View>

                    {/* Receipts list */}
                    <ScrollView
                        style={styles.receiptsListContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        {RECEIPTS_DATA.map((receipt) => (
                            <TouchableOpacity
                                key={receipt.id}
                                style={styles.receiptCardWrapper}
                                onPress={() => setSelectedReceipt(receipt)}
                                activeOpacity={0.7}
                            >
                                {/* Left notch */}
                                <View style={styles.receiptNotchLeft} />

                                <View style={styles.receiptCard}>
                                    <View style={styles.receiptLogoContainer}>
                                        <View style={styles.blankLogo} />
                                    </View>

                                    <View style={styles.receiptDivider} />

                                    <View style={styles.receiptInfo}>
                                        <ThemedText style={styles.receiptStoreName}>{receipt.storeName}</ThemedText>
                                        <View style={styles.receiptPointsRow}>
                                            <Ionicons name="leaf" size={16} color="#264e36" />
                                            <ThemedText style={styles.receiptPoints}>{receipt.points}</ThemedText>
                                        </View>
                                        <ThemedText style={styles.receiptDate}>{receipt.date}</ThemedText>
                                    </View>
                                </View>

                                {/* Right notch */}
                                <View style={styles.receiptNotchRight} />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        );
    }

    if (showFriends) {
        return (
            <View style={styles.friendsContainer}>
                {/* Header */}
                <ThemedView style={styles.friendsHeader} lightColor="#264e36" />


                {/* Content area */}
                <View style={styles.friendsContent}>
                    {/* Title row with back button and add button */}
                    <View style={styles.titleRow}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => setShowFriends(false)}
                        >
                            <Ionicons name="chevron-back-outline" size={28} color="#264e36" />
                        </TouchableOpacity>

                        <ThemedText style={styles.friendsTitle}>Friends</ThemedText>

                        <TouchableOpacity style={styles.addButton}>
                            <View style={styles.addButtonCircle}>
                                <Ionicons name="add" size={20} color="#264e36" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Friends list */}
                    <ScrollView
                        style={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        {FRIENDS_DATA.map((friend) => (
                            <TouchableOpacity key={friend.id} style={styles.friendCard}>
                                <View style={styles.friendAvatarContainer}>
                                    <Image
                                        source={{ uri: friend.avatar }}
                                        style={styles.friendAvatar}
                                    />
                                </View>
                                <ThemedText style={styles.friendName}>{friend.name}</ThemedText>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        );
    }

    if (showNotifications) {
        return (
            <View style={styles.notificationsContainer}>
                {/* Header */}
                <ThemedView style={styles.notificationsHeader} lightColor="#264e36">
                    <TouchableOpacity
                        style={styles.notificationsBackButton}
                        onPress={() => setShowNotifications(false)}
                    >
                        <Ionicons name="chevron-back-outline" size={28} color="#f5f0e6" />
                    </TouchableOpacity>
                </ThemedView>

                {/* Content area */}
                <View style={styles.notificationsContent}>
                    {/* Notifications card with bell */}
                    <View style={styles.notificationsCardWrapper}>
                        <View style={styles.notificationsCard}>
                            <Ionicons name="notifications-outline" size={32} color="#f5f0e6" style={styles.notificationsBellEmoji} />
                            <ThemedText style={styles.notificationsCardTitle}>Notifications</ThemedText>
                        </View>
                    </View>

                    {/* Toggle options */}
                    <View style={styles.notificationsToggleWrapper}>
                        <View style={styles.notificationsToggleRow}>
                            <ThemedText style={styles.notificationsToggleLabel}>Push Notifications</ThemedText>
                            <Switch
                                value={pushNotifications}
                                onValueChange={setPushNotifications}
                                trackColor={{ false: '#ccc', true: '#5ca377' }}
                                thumbColor="#fff"
                            />
                        </View>

                        <View style={styles.notificationsToggleRow}>
                            <ThemedText style={styles.notificationsToggleLabel}>Email Notifications</ThemedText>
                            <Switch
                                value={emailNotifications}
                                onValueChange={setEmailNotifications}
                                trackColor={{ false: '#ccc', true: '#5ca377' }}
                                thumbColor="#fff"
                            />
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    if (showSupport) {
        return (
            <View style={styles.supportContainer}>
                {/* Header */}
                <ThemedView style={styles.supportHeader} lightColor="#264e36">
                    <TouchableOpacity
                        style={styles.supportBackButton}
                        onPress={() => setShowSupport(false)}
                    >
                        <Ionicons name="chevron-back-outline" size={28} color="#f5f0e6" />
                    </TouchableOpacity>
                </ThemedView>

                {/* Content area */}
                <ScrollView style={styles.supportContent} showsVerticalScrollIndicator={false}>
                    {/* Support card with phone */}
                    <View style={styles.supportCardWrapper}>
                        <View style={styles.supportCard}>
                            <Ionicons name="call-outline" size={32} color="#f5f0e6" style={styles.supportPhoneEmoji} />
                            <ThemedText style={styles.supportCardTitle}>Support</ThemedText>
                        </View>
                    </View>

                    {/* Welcome text */}
                    <ThemedText style={styles.supportWelcomeText}>Welcome to EcoMax Support!</ThemedText>

                    {/* Action buttons */}
                    <View style={styles.supportButtonsWrapper}>
                        <TouchableOpacity style={styles.supportButton}>
                            <ThemedText style={styles.supportButtonText}>How it Works</ThemedText>
                            <Ionicons name="chevron-forward" size={24} color="#f5f0e6" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.supportButton}>
                            <ThemedText style={styles.supportButtonText}>Report a Bug</ThemedText>
                            <Ionicons name="chevron-forward" size={24} color="#f5f0e6" />
                        </TouchableOpacity>
                    </View>

                    {/* FAQs section */}
                    <ThemedText style={styles.supportFaqTitle}>FAQs</ThemedText>

                    <View style={styles.supportButtonsWrapper}>
                        <TouchableOpacity style={styles.supportButton}>
                            <ThemedText style={styles.supportButtonText}>How do I scan a receipt?</ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.supportButton}>
                            <ThemedText style={styles.supportButtonText}>Why didn't my points show?</ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.supportButton}>
                            <ThemedText style={styles.supportButtonText}>How do I redeem rewards?</ThemedText>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }

    if (showPrivacy) {
        return (
            <View style={styles.privacyContainer}>
                {/* Header */}
                <ThemedView style={styles.privacyHeader} lightColor="#264e36">
                    <TouchableOpacity
                        style={styles.privacyBackButton}
                        onPress={() => setShowPrivacy(false)}
                    >
                        <Ionicons name="chevron-back-outline" size={28} color="#f5f0e6" />
                    </TouchableOpacity>
                </ThemedView>

                {/* Content area */}
                <ScrollView style={styles.privacyContent} showsVerticalScrollIndicator={false}>
                    {/* Privacy card with shield */}
                    <View style={styles.privacyCardWrapper}>
                        <View style={styles.privacyCard}>
                            <Ionicons name="shield-checkmark-outline" size={32} color="#f5f0e6" style={styles.privacyShieldEmoji} />
                            <ThemedText style={styles.privacyCardTitle}>Privacy</ThemedText>
                        </View>
                    </View>

                    {/* Privacy info cards */}
                    <View style={styles.privacyInfoWrapper}>
                        <View style={styles.privacyInfoCard}>
                            <ThemedText style={styles.privacyInfoText}>
                                At EcoMax, we prioritize your privacy. We collect data necessary to enhance your experience such as expiration dates and user preferences.
                            </ThemedText>
                        </View>

                        <View style={styles.privacyInfoCard}>
                            <ThemedText style={styles.privacyInfoText}>
                                Your information is never shared with third parties, and is securely stored.
                            </ThemedText>
                        </View>

                        <View style={styles.privacyInfoCard}>
                            <ThemedText style={styles.privacyInfoText}>
                                You can manage or delete your data at any time through the app settings.
                            </ThemedText>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    if (showSettings) {
        return (
            <View style={styles.settingsContainer}>
                {/* Header */}
                <ThemedView style={styles.settingsHeader} lightColor="#264e36" />

                {/* Content area */}
                <View style={styles.settingsContent}>
                    {/* Title row with back button */}
                    <View style={styles.settingsTitleRow}>
                        <TouchableOpacity
                            style={styles.settingsBackButton}
                            onPress={() => setShowSettings(false)}
                        >
                            <Ionicons name="chevron-back-outline" size={28} color="#264e36" />
                        </TouchableOpacity>

                        <ThemedText style={styles.settingsTitle}>Settings</ThemedText>

                        <View style={{ width: 28 }} />
                    </View>

                    {/* Settings menu items */}
                    <View style={styles.settingsMenuWrapper}>
                        <TouchableOpacity
                            style={styles.settingsMenuItem}
                            onPress={() => {
                                setShowSettings(false);
                                setShowAccountInfo(true);
                            }}
                        >
                            <Ionicons name="lock-closed-outline" size={24} color="#f5f0e6" />
                            <ThemedText style={styles.settingsMenuText}>Account Information</ThemedText>
                            <Ionicons name="chevron-forward" size={24} color="#f5f0e6" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.settingsMenuItem}
                            onPress={() => {
                                setShowSettings(false);
                                setShowNotifications(true);
                            }}
                        >
                            <Ionicons name="notifications-outline" size={24} color="#f5f0e6" />
                            <ThemedText style={styles.settingsMenuText}>Notifications</ThemedText>
                            <Ionicons name="chevron-forward" size={24} color="#f5f0e6" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.settingsMenuItem}
                            onPress={() => {
                                setShowSettings(false);
                                setShowSupport(true);
                            }}
                        >
                            <Ionicons name="call-outline" size={24} color="#f5f0e6" />
                            <ThemedText style={styles.settingsMenuText}>Support</ThemedText>
                            <Ionicons name="chevron-forward" size={24} color="#f5f0e6" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.settingsMenuItem}
                            onPress={() => {
                                setShowSettings(false);
                                setShowPrivacy(true);
                            }}
                        >
                            <Ionicons name="shield-checkmark-outline" size={24} color="#f5f0e6" />
                            <ThemedText style={styles.settingsMenuText}>Privacy</ThemedText>
                            <Ionicons name="chevron-forward" size={24} color="#f5f0e6" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.settingsMenuItem, { marginTop: 20, backgroundColor: '#C0392B' }]}
                            onPress={() => router.replace('/(auth)')}
                        >
                            <Ionicons name="log-out-outline" size={24} color="#f5f0e6" />
                            <ThemedText style={styles.settingsMenuText}>Sign Out</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <ThemedView style={styles.header} lightColor="#264e36">
                <View style={styles.headerContent}>
                    <View style={{ width: 28 }} />
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity onPress={() => setShowSettings(true)}>
                        <Ionicons name="settings-outline" size={28} color="#f5f0e6" />
                    </TouchableOpacity>
                </View>
            </ThemedView>

            {/* Eco points pill */}
            <View style={styles.pointsPillWrapper}>
                <ThemedView style={styles.pointsPill} lightColor="#5ca377">
                    <ThemedText style={styles.pointsPillText}>350</ThemedText>
                </ThemedView>
            </View>

            {/* Profile card */}
            <View style={styles.profileCardWrapper}>
                <ThemedView style={styles.profileCard} lightColor="#5ca377">
                    <View style={styles.avatarRow}>
                        <View style={styles.avatarOuter}>
                            <Image
                                source={require('../../assets/pfp/js_pfp.jpg')}
                                style={styles.avatar}
                            />
                        </View>
                    </View>

                    <ThemedText style={styles.name} type="title">
                        James Smith
                    </ThemedText>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <ThemedText style={styles.statLabel}>Lifetime</ThemedText>
                            <ThemedText style={styles.statValue}>1,352</ThemedText>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.statItem}>
                            <ThemedText style={styles.statLabel}>Eco Challenge</ThemedText>
                            <ThemedText style={styles.statValue}>6/7</ThemedText>
                        </View>
                    </View>

                    <View style={styles.iconsRow}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="receipt-outline" size={32} color="#f5f0e6" />
                        </View>
                        <View style={styles.iconCircle}>
                            <Ionicons name="people-outline" size={32} color="#f5f0e6" />
                        </View>
                        <View style={styles.iconCircle}>
                            <Ionicons name="medal-outline" size={32} color="#f5f0e6" />
                        </View>
                        <View style={styles.iconCircle}>
                            <Ionicons name="card-outline" size={32} color="#f5f0e6" />
                            <View style={{
                                position: 'absolute',
                                right: 8,
                                bottom: 8,
                                backgroundColor: '#f5f0e6',
                                borderRadius: 8,
                                paddingHorizontal: 6,
                                paddingVertical: 2,
                            }}>
                                <ThemedText style={{ color: '#264e36', fontWeight: 'bold', fontSize: 12 }}>100</ThemedText>
                            </View>
                        </View>
                    </View>
                </ThemedView>
            </View>

            {/* Action buttons */}
            <View style={styles.actionsWrapper}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => setShowAccountInfo(true)}>
                    <ThemedText style={styles.actionText}>Account Information</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtn} onPress={() => setShowHistory(true)}>
                    <ThemedText style={styles.actionText}>History</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtn} onPress={() => setShowFriends(true)}>
                    <ThemedText style={styles.actionText}>Friends</ThemedText>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f0e6',
    },

    header: {
        backgroundColor: '#264e36',
        paddingTop: 64,
        paddingBottom: 120,
        paddingLeft: 20,
    },

    pointsPillWrapper: {
        alignItems: 'center',
        marginTop: -36,
    },

    pointsPill: {
        paddingVertical: 10,
        paddingHorizontal: 28,
        backgroundColor: '#5ca377',
        borderRadius: 14,
        width: '48%',
        alignItems: 'center',
    },

    pointsPillText: {
        color: '#f5f0e6',
        fontSize: 22,
        fontFamily: 'Quicksand_700Bold',
    },

    profileCardWrapper: {
        alignItems: 'center',
        marginTop: 50,
    },

    profileCard: {
        width: '86%',
        backgroundColor: '#5ca377',
        borderRadius: 14,
        paddingVertical: 18,
        paddingHorizontal: 16,
        alignItems: 'center',
    },

    avatarRow: {
        marginTop: -48,
        marginBottom: 8,
    },

    avatarOuter: {
        width: 92,
        height: 92,
        borderRadius: 46,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },

    avatar: {
        width: '100%',
        height: '100%',
    },

    name: {
        color: '#f5f0e6',
        marginTop: 6,
        marginBottom: 12,
        fontWeight: '700',
    },

    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
        marginBottom: 12,
    },

    statItem: {
        alignItems: 'center',
        flex: 1,
    },

    statLabel: {
        color: '#f5f0e6',
        fontSize: 12,
        marginBottom: 6,
    },

    statValue: {
        color: '#f5f0e6',
        fontSize: 24,
        fontFamily: 'Quicksand_700Bold',
        marginTop: 4,
        maxWidth: '100%',
        textAlign: 'center',
    },

    divider: {
        width: 1.4,
        backgroundColor: '#f5f0e6',
        height: 40,
        marginHorizontal: 4,
    },

    iconsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#264e36',
        paddingVertical: 10,
        paddingHorizontal: 8,
        width: '100%',
        borderRadius: 10,
    },

    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#264e36',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.06)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    iconText: {
        color: '#F5F0E6',
        fontSize: 16,
        fontWeight: '600',
    },

    actionsWrapper: {
        paddingHorizontal: 24,
        marginTop: 50,
        marginBottom: 40,
    },

    actionBtn: {
        backgroundColor: '#a47148',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 12,
    },

    actionText: {
        color: '#f5f0e6',
        fontSize: 22,
        fontFamily: 'Quicksand_700Bold',
    },

    // Friends view styles
    friendsContainer: {
        flex: 1,
        backgroundColor: '#f5f0e6',
    },

    friendsHeader: {
        backgroundColor: '#264e36',
        paddingTop: 50,
        paddingBottom: 20,
        paddingLeft: 16,
    },

    headerIcon: {
        width: 40,
        height: 40,
    },

    friendsContent: {
        flex: 1,
        backgroundColor: '#f5f0e6',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -20,
        paddingTop: 20,
    },

    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 16,
    },

    backButton: {
        padding: 4,
    },

    friendsTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#264e36',
        flex: 1,
        textAlign: 'center',
    },

    addButton: {
        padding: 4,
    },

    addButtonCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#264e36',
        justifyContent: 'center',
        alignItems: 'center',
    },

    listContainer: {
        flex: 1,
        paddingHorizontal: 24,
    },

    friendCard: {
        backgroundColor: '#5ca377',
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },

    friendAvatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        overflow: 'hidden',
        marginRight: 16,
    },

    friendAvatar: {
        width: '100%',
        height: '100%',
    },

    friendName: {
        color: '#f5f0e6',
        fontSize: 20,
        fontFamily: 'Quicksand_700Bold',
    },

    // Account Information view styles
    accountContainer: {
        flex: 1,
        backgroundColor: '#f5f0e6',
    },

    accountHeader: {
        backgroundColor: '#264e36',
        paddingTop: 50,
        paddingBottom: 30,
        paddingLeft: 16,
    },

    accountBackButton: {
        padding: 4,
        width: 40,
    },

    accountContent: {
        flex: 1,
        backgroundColor: '#f5f0e6',
    },

    accountCardWrapper: {
        alignItems: 'center',
        marginTop: -10,
        paddingHorizontal: 24,
    },

    accountCard: {
        backgroundColor: '#5ca377',
        borderRadius: 20,
        paddingVertical: 24,
        paddingHorizontal: 40,
        alignItems: 'center',
        width: '100%',
    },

    accountCardTitle: {
        color: '#f5f0e6',
        fontSize: 22,
        fontFamily: 'Quicksand_700Bold',
        marginTop: 12,
    },

    accountAvatarWrapper: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },

    accountAvatarOuter: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#fff',
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: '#264e36',
    },

    accountAvatarImage: {
        width: '100%',
        height: '100%',
    },

    formContainer: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },

    inputGroup: {
        marginBottom: 16,
    },

    inputLabel: {
        color: '#161618',
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        marginBottom: 4,
        marginLeft: 12,
    },

    textInput: {
        backgroundColor: '#fff',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#161618',
        paddingVertical: 14,
        paddingHorizontal: 16,
        fontSize: 17,
        color: '#161618',
        fontFamily: 'Quicksand_700Bold',
    },

    saveButton: {
        backgroundColor: '#a8c5a8',
        borderRadius: 20,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 16,
    },

    saveButtonText: {
        color: '#264e36',
        fontSize: 18,
        fontFamily: 'Quicksand_700Bold',
    },

    // History/My Receipts view styles
    historyContainer: {
        flex: 1,
        backgroundColor: '#f5f0e6',
    },

    historyHeader: {
        backgroundColor: '#264e36',
        paddingTop: 50,
        paddingBottom: 20,
        paddingLeft: 16,
    },

    historyContent: {
        flex: 1,
        backgroundColor: '#f5f0e6',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -20,
        paddingTop: 20,
    },

    historyTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 24,
    },

    historyBackButton: {
        padding: 4,
    },

    historyTitle: {
        fontSize: 32,
        lineHeight: 42,
        fontFamily: 'Quicksand_700Bold',
        color: '#264e36',
        flex: 1,
        textAlign: 'center',
    },

    receiptsListContainer: {
        flex: 1,
        paddingHorizontal: 24,
    },

    receiptCardWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        position: 'relative',
    },

    receiptNotchLeft: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#f5f0e6',
        position: 'absolute',
        left: -10,
        zIndex: 1,
    },

    receiptNotchRight: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#f5f0e6',
        position: 'absolute',
        right: -10,
        zIndex: 1,
    },

    receiptCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    receiptLogoContainer: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },

    targetLogo: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },

    targetOuterRing: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#e31837',
        position: 'absolute',
    },

    targetInnerRing: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#fff',
        position: 'absolute',
    },

    targetCenter: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#e31837',
        position: 'absolute',
    },

    indeuLogo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#5c5c3d',
        justifyContent: 'center',
        alignItems: 'center',
    },

    blankLogo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
    },

    receiptDivider: {
        width: 2,
        height: 50,
        backgroundColor: '#e0e0e0',
        marginHorizontal: 16,
        borderStyle: 'dashed',
    },

    receiptInfo: {
        flex: 1,
    },

    receiptStoreName: {
        fontSize: 20,
        fontFamily: 'Quicksand_700Bold',
        color: '#161618',
        marginBottom: 4,
    },

    receiptPointsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },

    receiptPoints: {
        fontSize: 14,
        fontFamily: 'Quicksand_700Bold',
        color: '#161618',
        marginLeft: 4,
    },

    receiptDate: {
        fontSize: 12,
        color: '#161618',
        fontFamily: 'Poppins_400Regular',
    },

    // Receipt Detail view styles
    receiptDetailContainer: {
        flex: 1,
        backgroundColor: '#264e36',
    },

    receiptDetailHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 16,
    },

    receiptDetailBackButton: {
        padding: 4,
    },

    receiptDetailMenuButton: {
        padding: 4,
    },

    receiptDetailContent: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingTop: 40,
    },

    receiptDetailCard: {
        backgroundColor: '#f5f0e6',
        borderRadius: 8,
        paddingVertical: 24,
        paddingHorizontal: 24,
        width: '100%',
        alignItems: 'center',
    },

    receiptDetailLogoContainer: {
        marginBottom: 12,
    },

    receiptDetailTargetLogo: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },

    receiptDetailStoreName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#161618',
        marginBottom: 4,
    },

    receiptDetailDate: {
        fontSize: 14,
        color: '#161618',
        marginBottom: 16,
        fontFamily: 'Poppins_400Regular',
    },

    receiptDashedLine: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#161618',
        borderStyle: 'dashed',
        marginVertical: 8,
    },

    receiptItemsContainer: {
        width: '100%',
        paddingVertical: 8,
    },

    receiptItemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 6,
    },

    receiptItemText: {
        fontSize: 14,
        color: '#161618',
        fontFamily: 'Poppins_400Regular',
        flex: 1,
    },

    receiptItemPrice: {
        fontSize: 14,
        color: '#161618',
        fontFamily: 'Poppins_400Regular',
        marginLeft: 16,
    },

    receiptTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 4,
    },

    receiptTotalLabel: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#161618',
    },

    receiptTotalValue: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        color: '#161618',
    },

    receiptPointsEarned: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },

    receiptPointsEarnedText: {
        fontSize: 36,
        lineHeight: 40,
        fontFamily: 'Quicksand_700Bold',
        color: '#161618',
        marginLeft: 8,
    },

    // Receipt Image view styles
    receiptImageContainer: {
        flex: 1,
        backgroundColor: '#264e36',
    },

    receiptImageHeader: {
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 16,
    },

    receiptImageBackButton: {
        padding: 4,
        width: 40,
    },

    receiptImageContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 40,
    },

    receiptImage: {
        width: '100%',
        height: '100%',
        maxHeight: '90%',
    },

    // Header content for gear icon
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 20,
    },

    // Settings view styles
    settingsContainer: {
        flex: 1,
        backgroundColor: '#f5f0e6',
    },

    settingsHeader: {
        backgroundColor: '#264e36',
        paddingTop: 50,
        paddingBottom: 40,
    },

    settingsContent: {
        flex: 1,
        backgroundColor: '#f5f0e6',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -20,
        paddingTop: 20,
    },

    settingsTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 24,
    },

    settingsBackButton: {
        padding: 4,
    },

    settingsTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#264e36',
        flex: 1,
        textAlign: 'center',
    },

    settingsMenuWrapper: {
        paddingHorizontal: 24,
    },

    settingsMenuItem: {
        backgroundColor: '#a47148',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },

    settingsMenuText: {
        color: '#f5f0e6',
        fontSize: 22,
        fontFamily: 'Quicksand_700Bold',
        flex: 1,
        marginLeft: 12,
    },

    // Notifications view styles
    notificationsContainer: {
        flex: 1,
        backgroundColor: '#f5f0e6',
    },

    notificationsHeader: {
        backgroundColor: '#264e36',
        paddingTop: 50,
        paddingBottom: 30,
        paddingLeft: 16,
    },

    notificationsBackButton: {
        padding: 4,
        width: 40,
    },

    notificationsContent: {
        flex: 1,
        backgroundColor: '#f5f0e6',
    },

    notificationsCardWrapper: {
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: 24,
    },

    notificationsCard: {
        backgroundColor: '#5ca377',
        borderRadius: 20,
        paddingVertical: 24,
        paddingHorizontal: 40,
        alignItems: 'center',
        width: '100%',
    },

    notificationsBellEmoji: {
        fontSize: 60,
        marginTop: 20,
    },

    notificationsCardTitle: {
        color: '#f5f0e6',
        fontSize: 22,
        fontFamily: 'Quicksand_700Bold',
        marginTop: 12,
    },

    notificationsToggleWrapper: {
        paddingHorizontal: 24,
        marginTop: 30,
    },

    notificationsToggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },

    notificationsToggleLabel: {
        color: '#264e36',
        fontSize: 22,
        fontFamily: 'Quicksand_700Bold',
    },

    // Support view styles
    supportContainer: {
        flex: 1,
        backgroundColor: '#f5f0e6',
    },

    supportHeader: {
        backgroundColor: '#264e36',
        paddingTop: 50,
        paddingBottom: 30,
        paddingLeft: 16,
    },

    supportBackButton: {
        padding: 4,
        width: 40,
    },

    supportContent: {
        flex: 1,
        backgroundColor: '#f5f0e6',
    },

    supportCardWrapper: {
        alignItems: 'center',
        marginTop: 70,
        paddingHorizontal: 24,
    },

    supportCard: {
        backgroundColor: '#5ca377',
        borderRadius: 20,
        paddingVertical: 24,
        paddingHorizontal: 40,
        alignItems: 'center',
        width: '100%',
    },

    supportPhoneEmoji: {
        fontSize: 60,
        marginTop: 20,
    },

    supportCardTitle: {
        color: '#f5f0e6',
        fontSize: 22,
        fontFamily: 'Quicksand_700Bold',
        marginTop: 12,
    },

    supportWelcomeText: {
        color: '#264e36',
        fontSize: 22,
        fontFamily: 'Quicksand_700Bold',
        textAlign: 'center',
        marginTop: 24,
        marginBottom: 16,
        paddingHorizontal: 24,
    },

    supportButtonsWrapper: {
        paddingHorizontal: 24,
    },

    supportButton: {
        backgroundColor: '#a47148',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    supportButtonText: {
        color: '#f5f0e6',
        fontSize: 22,
        fontFamily: 'Quicksand_700Bold',
        flex: 1,
    },

    supportFaqTitle: {
        color: '#264e36',
        fontSize: 22,
        fontFamily: 'Quicksand_700Bold',
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 16,
    },

    // Privacy view styles
    privacyContainer: {
        flex: 1,
        backgroundColor: '#f5f0e6',
    },

    privacyHeader: {
        backgroundColor: '#264e36',
        paddingTop: 50,
        paddingBottom: 30,
        paddingLeft: 16,
    },

    privacyBackButton: {
        padding: 4,
        width: 40,
    },

    privacyContent: {
        flex: 1,
        backgroundColor: '#f5f0e6',
    },

    privacyCardWrapper: {
        alignItems: 'center',
        marginTop: 70,
        paddingHorizontal: 24,
    },

    privacyCard: {
        backgroundColor: '#5ca377',
        borderRadius: 20,
        paddingVertical: 24,
        paddingHorizontal: 40,
        alignItems: 'center',
        width: '100%',
    },

    privacyShieldEmoji: {
        fontSize: 60,
        marginTop: 20,
    },

    privacyCardTitle: {
        color: '#f5f0e6',
        fontSize: 22,
        fontFamily: 'Quicksand_700Bold',
        marginTop: 12,
    },

    privacyInfoWrapper: {
        paddingHorizontal: 24,
        marginTop: 24,
    },

    privacyInfoCard: {
        backgroundColor: '#a47148',
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 20,
        marginBottom: 16,
    },

    privacyInfoText: {
        color: '#f5f0e6',
        fontSize: 22,
        fontFamily: 'Poppins_400Regular',
        lineHeight: 26,
    },
});