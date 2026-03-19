import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  type Medicine = {
    id : Nat;
    name : Text;
    genericName : Text;
    category : Text;
    uses : Text;
    dosage : Text;
    sideEffects : Text;
    warnings : Text;
    manufacturer : Text;
    barcode : Text;
    featured : Bool;
  };

  module Medicine {
    public func compare(m1 : Medicine, m2 : Medicine) : Order.Order {
      Text.compare(m1.name, m2.name);
    };
  };

  var nextId = 1;

  let medicines = Map.empty<Nat, Medicine>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public shared ({ caller }) func addMedicine(medicine : Medicine) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add medicines");
    };

    let newMedicine : Medicine = {
      id = nextId;
      name = medicine.name;
      genericName = medicine.genericName;
      category = medicine.category;
      uses = medicine.uses;
      dosage = medicine.dosage;
      sideEffects = medicine.sideEffects;
      warnings = medicine.warnings;
      manufacturer = medicine.manufacturer;
      barcode = medicine.barcode;
      featured = false;
    };

    medicines.add(nextId, newMedicine);
    nextId += 1;
  };

  public shared ({ caller }) func updateMedicine(id : Nat, updatedMedicine : Medicine) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update medicines");
    };

    switch (medicines.get(id)) {
      case (null) {
        Runtime.trap("Medicine not found");
      };
      case (_) {
        let newMedicine : Medicine = {
          id;
          name = updatedMedicine.name;
          genericName = updatedMedicine.genericName;
          category = updatedMedicine.category;
          uses = updatedMedicine.uses;
          dosage = updatedMedicine.dosage;
          sideEffects = updatedMedicine.sideEffects;
          warnings = updatedMedicine.warnings;
          manufacturer = updatedMedicine.manufacturer;
          barcode = updatedMedicine.barcode;
          featured = updatedMedicine.featured;
        };
        medicines.add(id, newMedicine);
      };
    };
  };

  public shared ({ caller }) func deleteMedicine(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete medicines");
    };

    if (not medicines.containsKey(id)) {
      Runtime.trap("Medicine not found");
    };

    medicines.remove(id);
  };

  public query func getMedicine(id : Nat) : async Medicine {
    switch (medicines.get(id)) {
      case (null) {
        Runtime.trap("Medicine not found");
      };
      case (?medicine) {
        medicine;
      };
    };
  };

  public query func getAllMedicines() : async [Medicine] {
    medicines.values().toArray().sort();
  };

  public query func searchMedicines(searchTerm : Text) : async [Medicine] {
    let lowerSearchTerm = searchTerm.toLower();

    let matches = medicines.values().toArray().filter(
      func(m) {
        m.name.toLower().contains(#text lowerSearchTerm) or m.genericName.toLower().contains(#text lowerSearchTerm)
      }
    );

    matches;
  };

  public query func getFeaturedMedicines() : async [Medicine] {
    let filtered = medicines.values().toArray().filter(
      func(m) {
        m.featured;
      }
    );
    filtered;
  };

  public shared ({ caller }) func setFeatured(id : Nat, featured : Bool) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can set featured status");
    };

    switch (medicines.get(id)) {
      case (null) {
        Runtime.trap("Medicine not found");
      };
      case (?medicine) {
        let updatedMedicine : Medicine = {
          id = medicine.id;
          name = medicine.name;
          genericName = medicine.genericName;
          category = medicine.category;
          uses = medicine.uses;
          dosage = medicine.dosage;
          sideEffects = medicine.sideEffects;
          warnings = medicine.warnings;
          manufacturer = medicine.manufacturer;
          barcode = medicine.barcode;
          featured = featured;
        };
        medicines.add(id, updatedMedicine);
      };
    };
  };

  public query func getMedicineByBarcode(barcode : Text) : async Medicine {
    let iter = medicines.values();
    switch (iter.find(func(m) { m.barcode == barcode })) {
      case (null) {
        Runtime.trap("Medicine not found");
      };
      case (?medicine) {
        medicine;
      };
    };
  };

  public shared ({ caller }) func initializeSamples() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can initialize samples");
    };

    let sampleMedicines : [Medicine] = [
      {
        id = 1;
        name = "Ibuprofen";
        genericName = "Ibuprofen";
        category = "Analgesic";
        uses = "Pain relief, inflammation";
        dosage = "200-400mg every 4-6 hours";
        sideEffects = "Stomach upset, dizziness";
        warnings = "Avoid with ulcers, pregnancy";
        manufacturer = "Various";
        barcode = "123456789012";
        featured = false;
      },
      {
        id = 2;
        name = "Paracetamol";
        genericName = "Acetaminophen";
        category = "Analgesic";
        uses = "Pain relief, fever";
        dosage = "500-1000mg every 4-6 hours";
        sideEffects = "Rare liver issues";
        warnings = "Avoid overdose";
        manufacturer = "Various";
        barcode = "234567890123";
        featured = false;
      },
      {
        id = 3;
        name = "Amoxicillin";
        genericName = "Amoxicillin";
        category = "Antibiotic";
        uses = "Bacterial infections";
        dosage = "250-500mg every 8 hours";
        sideEffects = "Diarrhea, nausea";
        warnings = "Complete full course";
        manufacturer = "Various";
        barcode = "345678901234";
        featured = false;
      },
      {
        id = 4;
        name = "Cetirizine";
        genericName = "Cetirizine";
        category = "Antihistamine";
        uses = "Allergies, hay fever";
        dosage = "10mg once daily";
        sideEffects = "Drowsiness, dry mouth";
        warnings = "Use caution with driving";
        manufacturer = "Various";
        barcode = "456789012345";
        featured = false;
      },
      {
        id = 5;
        name = "Loperamide";
        genericName = "Loperamide";
        category = "Antidiarrheal";
        uses = "Diarrhea control";
        dosage = "2mg after each loose stool";
        sideEffects = "Constipation, dizziness";
        warnings = "Not for long-term use";
        manufacturer = "Various";
        barcode = "567890123456";
        featured = false;
      },
    ];

    for (medicine in sampleMedicines.values()) {
      medicines.add(medicine.id, medicine);
    };
    nextId := 6;
  };
};
